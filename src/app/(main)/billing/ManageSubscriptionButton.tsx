"use client";

import LoadingButton from "@/components/LoadingButton";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { createCustomerPortalSession } from "./actions";

export default function ManageSubscriptionButton() {
  const { toast } = useToast();

  const [loading, setLoading] = useState(false);

  async function handleClick() {
    try {
      setLoading(true);
      const redirectUrl = await createCustomerPortalSession();
      window.location.href = redirectUrl;
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        description: "エラーが発生しました。もう一度お試しください.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <LoadingButton onClick={handleClick} loading={loading}>
      プラン管理
    </LoadingButton>
  );
}
