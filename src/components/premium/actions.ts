"use server";

import { env } from "@/env";
import stripe from "@/lib/stripe";
import { currentUser } from "@clerk/nextjs/server";

/**
 * Stripeのチェックアウトセッションを作成する
 * @param priceId - 購入する商品のStripe価格ID
 * @returns チェックアウトセッションのURL
 * @throws {Error} ユーザーが認証されていない場合、またはセッションの作成に失敗した場合
 */
export async function createCheckoutSession(priceId: string) {
  // 現在のユーザーを取得
  const user = await currentUser();

  if (!user) {
    throw new Error("ユーザーが認証されていません");
  }

  // Stripeチェックアウトセッションを作成
  const session = await stripe.checkout.sessions.create({
    line_items: [{ price: priceId, quantity: 1 }],
    mode: "subscription",
    success_url: `${env.NEXT_PUBLIC_BASE_URL}/billing/success`,
    cancel_url: `${env.NEXT_PUBLIC_BASE_URL}/billing`,
    customer_email: user.emailAddresses[0].emailAddress,
    subscription_data: {
      metadata: {
        userId: user.id,
      },
    },
    custom_text: {
      terms_of_service_acceptance: {
        message: `CareerRiseの[利用規約](${env.NEXT_PUBLIC_BASE_URL}/tos)を読み、同意します。`,
      },
    },
    consent_collection: {
      terms_of_service: "required",
    },
  });

  // セッションURLが存在しない場合はエラーをスロー
  if (!session.url) {
    throw new Error("チェックアウトセッションの作成に失敗しました");
  }

  return session.url;
}
