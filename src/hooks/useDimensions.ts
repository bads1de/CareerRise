import React, { useEffect, useState } from "react";

/**
 * useDimensions Hook
 *
 * このカスタムフックは、指定された要素のサイズ（幅と高さ）を監視し、
 * サイズが変更されるたびに最新の寸法を提供します。
 *
 * 特徴:
 * - ResizeObserverを使用してリアルタイムにサイズ変更を検知
 * - メモリリークを防ぐためのクリーンアップ機能を内蔵
 * - 要素が存在しない場合は{width: 0, height: 0}を返す
 *
 * @param containerRef - 監視対象となるHTML要素へのRef
 * @returns {Object} dimensions - 要素の現在の寸法
 * @returns {number} dimensions.width - 要素の幅（ピクセル）
 * @returns {number} dimensions.height - 要素の高さ（ピクセル）
 */
export default function useDimensions(
  containerRef: React.RefObject<HTMLElement>,
) {
  // 要素の寸法を保持するstate
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    // 現在のref要素を取得
    const currentRef = containerRef.current;

    /**
     * 要素の現在の寸法を取得する関数
     * 要素が存在しない場合は0を返す
     */
    const getDimensions = () => {
      return {
        width: currentRef?.offsetWidth || 0,
        height: currentRef?.offsetHeight || 0,
      };
    };

    // ResizeObserverを作成し、サイズ変更を監視
    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        setDimensions(getDimensions());
      }
    });

    // 要素が存在する場合、監視を開始し初期サイズを設定
    if (currentRef) {
      resizeObserver.observe(currentRef);
      setDimensions(getDimensions());
    }

    // クリーンアップ関数：コンポーネントのアンマウント時に監視を停止
    return () => {
      if (currentRef) {
        resizeObserver.unobserve(currentRef);
      }
      resizeObserver.disconnect();
    };
  }, [containerRef]); // containerRefが変更された場合のみ再実行

  return dimensions;
}
