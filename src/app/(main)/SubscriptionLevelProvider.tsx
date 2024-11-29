"use client";

import { SubscriptionLevel } from "@/lib/subscription";
import { createContext, ReactNode, useContext } from "react";

const SubscriptionLevelContext = createContext<SubscriptionLevel | undefined>(
  undefined,
);

interface SubscriptionLevelProviderProps {
  children: ReactNode;
  userSubscriptionLevel: SubscriptionLevel;
}

/**
 * 子コンポーネントにサブスクリプションレベルのコンテキストを提供します。
 *
 * @param {ReactNode} children - サブスクリプションレベルのコンテキストにアクセスできる子コンポーネント。
 * @param {SubscriptionLevel} userSubscriptionLevel - コンテキストに提供するサブスクリプションレベル。
 */
export default function SubscriptionLevelProvider({
  children,
  userSubscriptionLevel,
}: SubscriptionLevelProviderProps) {
  return (
    <SubscriptionLevelContext.Provider value={userSubscriptionLevel}>
      {children}
    </SubscriptionLevelContext.Provider>
  );
}

/**
 * コンテキストからサブスクリプションレベルを取得します。
 *
 * @throws {Error} SubscriptionLevelProviderでラップされていない場合にエラーをスローします。
 *
 * @returns {SubscriptionLevel} サブスクリプションレベル。
 */
export function useSubscriptionLevel() {
  const context = useContext(SubscriptionLevelContext);
  if (context === undefined) {
    throw new Error(
      "useSubscriptionLevelはSubscriptionLevelProvider内で使用する必要があります",
    );
  }
  return context;
}
