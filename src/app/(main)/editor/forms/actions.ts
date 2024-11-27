"use server";

import openai from "@/lib/openai";
import {
  GenerateSummaryInput,
  generateSummarySchema,
  GenerateWorkExperienceInput,
  generateWorkExperienceSchema,
  WorkExperience,
} from "@/lib/validation";

export async function generateSummary(input: GenerateSummaryInput) {
  // TODO: add block for non-premium users

  const { jobTitle, workExperiences, educations, skills } =
    generateSummarySchema.parse(input);

  const systemMessage = `
    あなたは履歴書生成AIです。ユーザーが提供したデータに基づいて、履歴書のための専門的な自己紹介文を作成することが任務です。
    回答には要約のみを含め、それ以外の情報は含めないでください。簡潔でプロフェッショナルな内容を心がけてください。
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
    model: "gemini-1.5-flash",
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
