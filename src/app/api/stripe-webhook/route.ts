/**
 * Stripe Webhook Handler
 *
 * このファイルはStripeからの支払い関連のイベント通知（webhook）を処理します。
 * Stripeで支払いやサブスクリプションの状態が変更されると、このエンドポイントに通知が送られます。
 */

import { env } from "@/env";
import prisma from "@/lib/prisma";
import stripe from "@/lib/stripe";
import { clerkClient } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";
import Stripe from "stripe";

/**
 * Webhookエンドポイント - POSTリクエストを処理
 *
 * @param req - Stripeからのwebhookリクエスト
 * @returns レスポンス（成功: 200, エラー: 400/500）
 */
export async function POST(req: NextRequest) {
  try {
    // webhookペイロードを取得
    const payload = await req.text();
    const signature = req.headers.get("stripe-signature");

    if (!signature) {
      return new Response("Missing Stripe signature", { status: 400 });
    }

    // Stripeイベントを検証して構築
    // これにより、リクエストが本当にStripeから送られてきたものか確認します
    const event = stripe.webhooks.constructEvent(
      payload,
      signature,
      env.STRIPE_WEBHOOK_SECRET,
    );

    console.log(`Received event: ${event.type}`, event.data.object);

    // イベントタイプに応じて適切なハンドラーを呼び出し
    switch (event.type) {
      case "checkout.session.completed":
        // 決済が完了した時の処理
        await handleSessionCompleted(event.data.object);
        break;

      case "customer.subscription.created":
      case "customer.subscription.updated":
        // サブスクリプションが作成または更新された時の処理
        await handleSubscriptionCreatedOrUpdated(event.data.object.id);
        break;

      case "customer.subscription.deleted":
        // サブスクリプションが削除された時の処理
        await handleSubscriptionDeleted(event.data.object);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
        break;
    }

    return new Response("Event received", { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response("Internal server error", { status: 500 });
  }
}

/**
 * 決済セッション完了時の処理
 * ユーザーのメタデータにStripeの顧客IDを保存します
 *
 * @param session - 完了した決済セッションの情報
 */
async function handleSessionCompleted(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.userId;

  if (!userId) {
    throw new Error("User ID not found in session metadata");
  }

  // ClerkのユーザーメタデータにStripeの顧客IDを保存
  await (
    await clerkClient()
  ).users.updateUserMetadata(userId, {
    privateMetadata: {
      stripeCustomerId: session.customer as string,
    },
  });
}

/**
 * サブスクリプション作成/更新時の処理
 * データベースのサブスクリプション情報を更新します
 *
 * @param subscriptionId - StripeのサブスクリプションID
 */
async function handleSubscriptionCreatedOrUpdated(subscriptionId: string) {
  // Stripeから最新のサブスクリプション情報を取得
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);

  // サブスクリプションがアクティブな場合（active/trialing/past_due）
  if (
    subscription.status === "active" ||
    subscription.status === "trialing" ||
    subscription.status === "past_due"
  ) {
    // データベースのサブスクリプション情報を作成または更新
    await prisma.userSubscription.upsert({
      where: {
        userId: subscription.metadata.userId,
      },
      create: {
        userId: subscription.metadata.userId,
        stripeSubscriptionId: subscription.id,
        stripeCustomerId: subscription.customer as string,
        stripePriceId: subscription.items.data[0].price.id,
        stripeCurrentPeriodEnd: new Date(
          subscription.current_period_end * 1000,
        ),
        stripeCancelAtPeriodEnd: subscription.cancel_at_period_end,
      },
      update: {
        stripePriceId: subscription.items.data[0].price.id,
        stripeCurrentPeriodEnd: new Date(
          subscription.current_period_end * 1000,
        ),
        stripeCancelAtPeriodEnd: subscription.cancel_at_period_end,
      },
    });
  } else {
    // サブスクリプションが無効な場合、データベースから削除
    await prisma.userSubscription.deleteMany({
      where: {
        stripeCustomerId: subscription.customer as string,
      },
    });
  }
}

/**
 * サブスクリプション削除時の処理
 * データベースからサブスクリプション情報を削除します
 *
 * @param subscription - 削除されたサブスクリプションの情報
 */
async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  await prisma.userSubscription.deleteMany({
    where: {
      stripeCustomerId: subscription.customer as string,
    },
  });
}
