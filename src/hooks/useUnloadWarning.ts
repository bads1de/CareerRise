import { useEffect } from "react";

/**
 * ページの離脱時に警告を表示するカスタムフック
 *
 * @param condition - 警告を表示する条件。デフォルトはtrue
 *
 * @description
 * このフックは、ユーザーがページを離れようとしたときに警告を表示します。
 * 主に、フォームの未保存の変更がある場合などに使用されます。
 *
 * @example
 * ```
 * const isDirty = true;
 * useUnloadWarning(isDirty);
 * ```
 */
export default function useUnloadWarning(condition = true) {
  useEffect(() => {
    if (!condition) {
      return;
    }

    const listener = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };

    window.addEventListener("beforeunload", listener);
    return () => {
      window.removeEventListener("beforeunload", listener);
    };
  }, [condition]);
}
