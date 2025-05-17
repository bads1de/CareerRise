"use server";

import openai from "@/lib/openai";
import { canUseAITools } from "@/lib/permissions";
import { getUserSubscriptionLevel } from "@/lib/subscription";
import {
  GenerateSummaryInput,
  generateSummarySchema,
  GenerateWorkExperienceInput,
  generateWorkExperienceSchema,
  WorkExperience,
} from "@/lib/validation";
import { auth } from "@clerk/nextjs/server";

export async function generateSummary(input: GenerateSummaryInput) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("User not authenticated");
  }

  const subscriptionLevel = await getUserSubscriptionLevel(userId);

  if (!canUseAITools(subscriptionLevel)) {
    throw new Error("AI tools are not available");
  }

  const { jobTitle, workExperiences, educations, skills } =
    generateSummarySchema.parse(input);

  const systemMessage = `
    あなたは履歴書生成AIです。ユーザーが提供したデータに基づいて、履歴書のための専門的な自己紹介文を作成することが任務です。
    回答には要約のみを含め、それ以外の情報は含めないでください。100文字以上で回答してください。プロフェッショナルな内容を心がけてください。
    `;

  const userMessage = `
    以下のデータから専門的な履歴書の要約を生成してください：

    職種: ${jobTitle || "該当なし"}

    職歴:
    ${workExperiences
      ?.map(
        (exp) => `
        役職: ${exp.position || "該当なし"} at ${exp.company || "該当なし"} (${exp.startDate || "該当なし"} ～ ${exp.endDate || "現在"})

        職務内容:
        ${exp.description || "該当なし"}
        `,
      )
      .join("\n\n")}

      学歴:
    ${educations
      ?.map(
        (edu) => `
        学位: ${edu.degree || "該当なし"} at ${edu.school || "該当なし"} (${edu.startDate || "該当なし"} ～ ${edu.endDate || "該当なし"})
        `,
      )
      .join("\n\n")}

      スキル:
      ${skills}
    `;

  const completion = await openai.chat.completions.create({
    model: "gemini-2.5-flash",
    messages: [
      {
        role: "system",
        content: systemMessage,
      },
      {
        role: "user",
        content: userMessage,
      },
    ],
  });

  const aiResponse = completion.choices[0].message.content;

  if (!aiResponse) {
    throw new Error("AI response is empty");
  }

  return aiResponse;
}

export async function generateWorkExperience(
  input: GenerateWorkExperienceInput,
) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("User not authenticated");
  }

  const subscriptionLevel = await getUserSubscriptionLevel(userId);

  if (!canUseAITools(subscriptionLevel)) {
    throw new Error("AI tools are not available");
  }

  const { description } = generateWorkExperienceSchema.parse(input);

  const systemMessage = `
  あなたは職務経歴書生成AIです。ユーザーの入力に基づいて、単一の職務経歴エントリーを生成することが任務です。
  回答は以下の構造に従う必要があります。提供されたデータから推測できない項目は省略できますが、新しい項目を追加しないでください。

  役職: <役職>
  会社名: <会社名>
  開始日: <形式: YYYY-MM-DD> (提供された場合のみ)
  終了日: <形式: YYYY-MM-DD> (提供された場合のみ)
  職務内容: <最適化された説明を箇条書き形式で、役職から推測される場合もあります>
  `;

  const userMessage = `
  以下の説明から職務経歴エントリーを提供してください:
  ${description}
  `;

  const completion = await openai.chat.completions.create({
    model: "gemini-2.5-flash",
    messages: [
      {
        role: "system",
        content: systemMessage,
      },
      {
        role: "user",
        content: userMessage,
      },
    ],
  });

  const aiResponse = completion.choices[0].message.content;

  if (!aiResponse) {
    throw new Error("AI response is empty");
  }

  return {
    position: aiResponse.match(/役職: (.*)/)?.[1] || "",
    company: aiResponse.match(/会社名: (.*)/)?.[1] || "",
    description: (aiResponse.match(/職務内容:([\s\S]*)/)?.[1] || "").trim(),
    startDate: aiResponse.match(/開始日: (\d{4}-\d{2}-\d{2})/)?.[1],
    endDate: aiResponse.match(/終了日: (\d{4}-\d{2}-\d{2})/)?.[1],
  } satisfies WorkExperience;
}
