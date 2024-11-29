import prisma from "@/lib/prisma";
import stripe from "@/lib/stripe";
import { auth } from "@clerk/nextjs/server";
import { formatDate } from "date-fns";
import { Metadata } from "next";
import Stripe from "stripe";
import ManageSubscriptionButton from "./ManageSubscriptionButton";
import GetSubscriptionButton from "./GetSubscriptionButton";

export const metadata: Metadata = {
  title: "プラン・支払い情報",
};

export default async function Page() {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  const subscription = await prisma.userSubscription.findUnique({
    where: { userId },
  });

  const priceInfo = subscription
    ? await stripe.prices.retrieve(subscription.stripePriceId, {
        expand: ["product"],
      })
    : null;

  return (
    <main className="mx-auto w-full max-w-7xl space-y-6 px-3 py-6">
      <h1 className="text-3xl font-bold">プラン・支払い情報</h1>
      <p>
        現在のプラン：{" "}
        <span className="font-bold">
          {priceInfo ? (priceInfo.product as Stripe.Product).name : "無料プラン"}
        </span>
      </p>
      {subscription ? (
        <>
          {subscription.stripeCancelAtPeriodEnd && (
            <p className="text-destructive">
              プランは{formatDate(subscription.stripeCurrentPeriodEnd, "yyyy年MM月dd日")}に解約されます
            </p>
          )}
          <ManageSubscriptionButton />
        </>
      ) : (
        <GetSubscriptionButton />
      )}
    </main>
  );
}
