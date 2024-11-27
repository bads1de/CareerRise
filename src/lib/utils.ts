import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

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
