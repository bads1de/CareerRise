import { Prisma } from "@prisma/client";
import { ResumeValues } from "./validation";

/**
 * エディターフォームのプロパティを定義するインターフェース
 */
export interface EditorFormProps {
  /** 履歴書データ */
  resumeData: ResumeValues;
  /** 履歴書データを更新する関数 */
  setResumeData: (data: ResumeValues) => void;
}

/**
 * 履歴書データに含める関連データを指定するオブジェクト
 */
export const resumeDataInclude = {
  workExperiences: true, // 職歴情報を含める
  educations: true, // 学歴情報を含める
} satisfies Prisma.ResumeInclude;

/**
 * サーバーサイドで使用する履歴書データの型定義
 * resumeDataIncludeで指定された関連データを含む
 */
export type ResumeServerData = Prisma.ResumeGetPayload<{
  include: typeof resumeDataInclude;
}>;
