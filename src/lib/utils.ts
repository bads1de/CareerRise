import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { ResumeServerData } from "./types";
import { ResumeValues } from "./validation";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * ファイルオブジェクトを単純なオブジェクトに変換する関数
 *
 * @param key - オブジェクトのキー（この関数では使用されませんが、JSON.stringifyのreplacer関数の形式に合わせるため含まれています）
 * @param value - 変換対象の値
 * @returns 変換された値。Fileオブジェクトの場合は単純なオブジェクトに、それ以外の場合は元の値をそのまま返します
 */
export function fileReplacer(key: unknown, value: unknown) {
  return value instanceof File
    ? {
        name: value.name,
        size: value.size,
        type: value.type,
        lastModified: value.lastModified,
      }
    : value;
}

/**
 * サーバーサイドの履歴書データをクライアントサイド形式に変換します。
 *
 * この関数は、履歴書のサーバーサイド表現である `ResumeServerData` から、
 * クライアントサイド表現である `ResumeValues` へのデータマッピングを行います。
 * これには、職歴や学歴などのフィールドを、クライアントサイドアプリケーションに
 * より適した形式に変換することが含まれます。
 *
 * @param data - 変換対象のサーバーサイド履歴書データ。
 * @returns クライアントサイド形式にフォーマットされた履歴書データ。
 */
export function mapToResumeValues(data: ResumeServerData): ResumeValues {
  return {
    id: data.id,
    title: data.title || undefined,
    description: data.description || undefined,
    photo: data.photoUrl || undefined,
    firstName: data.firstName || undefined,
    lastName: data.lastName || undefined,
    jobTitle: data.jobTitle || undefined,
    city: data.city || undefined,
    country: data.country || undefined,
    phone: data.phone || undefined,
    email: data.email || undefined,
    workExperiences: data.workExperiences.map((exp) => ({
      position: exp.position || undefined,
      company: exp.company || undefined,
      startDate: exp.startDate?.toISOString().split("T")[0],
      endDate: exp.endDate?.toISOString().split("T")[0],
      description: exp.description || undefined,
    })),
    educations: data.educations.map((edu) => ({
      degree: edu.degree || undefined,
      school: edu.school || undefined,
      startDate: edu.startDate?.toISOString().split("T")[0],
      endDate: edu.endDate?.toISOString().split("T")[0],
    })),
    skills: data.skills,
    borderStyle: data.borderStyle,
    colorHex: data.colorHex,
    summary: data.summary || undefined,
  };
}
