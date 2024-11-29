import LoadingButton from "@/components/LoadingButton";
import { useToast } from "@/hooks/use-toast";
import { ResumeValues } from "@/lib/validation";
import { WandSparklesIcon } from "lucide-react";
import { useState } from "react";
import { generateSummary } from "./actions";
import { useSubscriptionLevel } from "../../SubscriptionLevelProvider";
import usePremiumModal from "@/hooks/usePremiumModal";
import { canUseAITools } from "@/lib/permissions";

interface GenerateSummaryButtonProps {
  resumeData: ResumeValues;
  onSummaryGenerated: (summary: string) => void;
}

export default function GenerateSummaryButton({
  resumeData,
  onSummaryGenerated,
}: GenerateSummaryButtonProps) {
  const subscriptionLevel = useSubscriptionLevel();

  const premiumModal = usePremiumModal();

  const { toast } = useToast();

  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (!canUseAITools(subscriptionLevel)) {
      premiumModal.setOpen(true);
      return;
    }

    try {
      setLoading(true);

      const aiResponse = await generateSummary(resumeData);
      onSummaryGenerated(aiResponse);
    } catch (error) {
      console.error("Error generating summary:", error);
      toast({
        title: "エラー",
        description: "自己紹介文の生成に失敗しました。",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoadingButton
      loading={loading}
      variant={"outline"}
      type="button"
      onClick={handleClick}
    >
      <WandSparklesIcon className="size-4" />
      AI生成
    </LoadingButton>
  );
}
