"use server";

import { canCreateResume, canUseCustomizations } from "@/lib/permissions";
import prisma from "@/lib/prisma";
import { getUserSubscriptionLevel } from "@/lib/subscription";
import { resumeSchema, ResumeValues } from "@/lib/validation";
import { auth } from "@clerk/nextjs/server";
import { del, put } from "@vercel/blob";
import path from "path";

/**
 * 履歴書データを保存または更新する関数
 * @param values - 保存する履歴書データ（ResumeValues型）
 * @throws {Error} - 以下の場合にエラーを投げる：
 *  - ユーザーが未認証の場合
 *  - サブスクリプションレベルで許可された履歴書の最大数に達した場合
 *  - 指定されたIDの履歴書が見つからない場合
 *  - サブスクリプションレベルでカスタマイズが許可されていない場合
 * @returns 保存または更新された履歴書データ
 */
export async function saveResume(values: ResumeValues) {
  const { id } = values;

  // 受け取ったデータをログ出力（デバッグ用）
  console.log("received values", values);

  // スキーマ検証とデータの分割
  // 写真、職歴、学歴を別々に処理するため、残りの基本情報と分離
  const { photo, workExperiences, educations, ...resumeValues } =
    resumeSchema.parse(values);

  // ユーザー認証の確認
  const { userId } = await auth();

  if (!userId) {
    throw new Error("User not authenticated");
  }

  // ユーザーのサブスクリプションレベルを取得
  const subscriptionLevel = await getUserSubscriptionLevel(userId);

  // 新規作成の場合、履歴書の作成上限をチェック
  if (!id) {
    const resumeCount = await prisma.resume.count({ where: { userId } });

    if (!canCreateResume(subscriptionLevel, resumeCount)) {
      throw new Error(
        "Maximum resume count reached for this subscription level",
      );
    }
  }

  // 既存の履歴書データを取得（更新の場合）
  const existingResume = id
    ? await prisma.resume.findUnique({ where: { id, userId } })
    : null;

  if (id && !existingResume) {
    throw new Error("Resume not found");
  }

  // カスタマイズ（枠線スタイルや色）の変更があるかチェック
  const hasCustomizations =
    (resumeValues.borderStyle &&
      resumeValues.borderStyle !== existingResume?.borderStyle) ||
    (resumeValues.colorHex &&
      resumeValues.colorHex !== existingResume?.colorHex);

  // カスタマイズの権限チェック
  if (hasCustomizations && !canUseCustomizations(subscriptionLevel)) {
    throw new Error("Customizations not allowed for this subscription level");
  }

  // 写真の処理
  // - 新規アップロード：既存の写真を削除し、新しい写真をBlobストレージに保存
  // - 写真の削除：既存の写真を削除し、photoUrlをnullに設定
  // - 変更なし：photoUrlは未定義のまま
  let newPhotoUrl: string | undefined | null = undefined;

  if (photo instanceof File) {
    // 新しい写真がアップロードされた場合、既存の写真を削除して新しい写真を保存
    if (existingResume?.photoUrl) {
      await del(existingResume.photoUrl);
    }

    const blob = await put(`resume_photos/${path.extname(photo.name)}`, photo, {
      access: "public",
    });

    newPhotoUrl = blob.url;
  } else if (photo === null) {
    // 写真を削除する場合、既存の写真をBlobストレージから削除
    if (existingResume?.photoUrl) {
      await del(existingResume.photoUrl);
    }
    newPhotoUrl = null;
  }

  if (id) {
    // 既存の履歴書を更新
    // - 基本情報の更新
    // - 写真URLの更新（アップロード、削除、または変更なし）
    // - 職歴・学歴データの完全な置き換え（既存データを削除して新規作成）
    return prisma.resume.update({
      where: { id },
      data: {
        ...resumeValues,
        photoUrl: newPhotoUrl,
        workExperiences: {
          deleteMany: {},
          create: workExperiences?.map((exp) => ({
            ...exp,
            startDate: exp.startDate ? new Date(exp.startDate) : undefined,
            endDate: exp.endDate ? new Date(exp.endDate) : undefined,
          })),
        },
        educations: {
          deleteMany: {},
          create: educations?.map((edu) => ({
            ...edu,
            startDate: edu.startDate ? new Date(edu.startDate) : undefined,
            endDate: edu.endDate ? new Date(edu.endDate) : undefined,
          })),
        },
        updatedAt: new Date(),
      },
    });
  } else {
    // 新規履歴書の作成
    // - 基本情報の保存
    // - アップロードされた写真のURL保存
    // - 職歴・学歴データの作成（日付はDate型に変換）
    return prisma.resume.create({
      data: {
        ...resumeValues,
        userId,
        photoUrl: newPhotoUrl,
        workExperiences: {
          create: workExperiences?.map((exp) => ({
            ...exp,
            startDate: exp.startDate ? new Date(exp.startDate) : undefined,
            endDate: exp.endDate ? new Date(exp.endDate) : undefined,
          })),
        },
        educations: {
          create: educations?.map((edu) => ({
            ...edu,
            startDate: edu.startDate ? new Date(edu.startDate) : undefined,
            endDate: edu.endDate ? new Date(edu.endDate) : undefined,
          })),
        },
      },
    });
  }
}
