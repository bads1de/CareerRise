"use server";

import { env } from "@/env";
import stripe from "@/lib/stripe";
import { currentUser } from "@clerk/nextjs/server";

/**
 * Stripeの支払いチェックアウトセッションを作成する
 *
 * @param priceId - Stripeの価格ID
 * @throws {Error} ユーザーが未認証の場合
 * @throws {Error} チェックアウトセッションの作成に失敗した場合
 * @returns チェックアウトセッションのURL
 *
 * @description
 * 1. 現在のユーザー情報を取得
 * 2. ユーザーが既存のStripe顧客IDを持っているか確認
 * 3. 以下の設定でチェックアウトセッションを作成:
 *   - サブスクリプションモード
 *   - 成功・キャンセル時のリダイレクトURL
 *   - 顧客情報（既存顧客IDまたはメールアドレス）
 *   - ユーザーIDのメタデータ
 *   - 利用規約の同意確認
 */
export async function createCheckoutSession(priceId: string) {
  const user = await currentUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const stripeCustomerId = user.privateMetadata.stripeCustomerId as
    | string
    | undefined;

  const session = await stripe.checkout.sessions.create({
    line_items: [{ price: priceId, quantity: 1 }],
    mode: "subscription",
    success_url: `${env.NEXT_PUBLIC_BASE_URL}/billing/success`,
    cancel_url: `${env.NEXT_PUBLIC_BASE_URL}/billing`,
    customer: stripeCustomerId,
    customer_email: stripeCustomerId
      ? undefined
      : user.emailAddresses[0].emailAddress,
    metadata: {
      userId: user.id,
    },
    subscription_data: {
      metadata: {
        userId: user.id,
      },
    },
    custom_text: {
      terms_of_service_acceptance: {
        message: `I have read AI Resume Builder's [terms of service](${env.NEXT_PUBLIC_BASE_URL}/tos) and agree to them.`,
      },
    },
    consent_collection: {
      terms_of_service: "required",
    },
  });

  if (!session.url) {
    throw new Error("Failed to create checkout session");
  }

  return session.url;
}
