import LoadingButton from "@/components/LoadingButton";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  GenerateWorkExperienceInput,
  generateWorkExperienceSchema,
  WorkExperience,
} from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { WandSparklesIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { generateWorkExperience } from "./actions";
import { useSubscriptionLevel } from "../../SubscriptionLevelProvider";
import usePremiumModal from "@/hooks/usePremiumModal";
import { canUseAITools } from "@/lib/permissions";

interface GenerateWorkExperienceButtonProps {
  onWorkExperienceGenerated: (workExperience: WorkExperience) => void;
}

export default function GenerateWorkExperienceButton({
  onWorkExperienceGenerated,
}: GenerateWorkExperienceButtonProps) {
  const subscriptionLevel = useSubscriptionLevel();

  const premiumModal = usePremiumModal();

  const [showInputDialog, setShowInputDialog] = useState(false);

  return (
    <>
      <Button
        variant={"outline"}
        type="button"
        onClick={() => {
          if (!canUseAITools(subscriptionLevel)) {
            premiumModal.setOpen(true);
            return;
          }
          setShowInputDialog(true);
        }}
      >
        <WandSparklesIcon className="size-4" />
        AI生成
      </Button>
      <InputDialog
        open={showInputDialog}
        onOpenChange={setShowInputDialog}
        onWorkExperienceGenerated={(workExperience) => {
          onWorkExperienceGenerated(workExperience);
          setShowInputDialog(false);
        }}
      />
    </>
  );
}

interface InputDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onWorkExperienceGenerated: (workExperience: WorkExperience) => void;
}

function InputDialog({
  open,
  onOpenChange,
  onWorkExperienceGenerated,
}: InputDialogProps) {
  const { toast } = useToast();

  const form = useForm<GenerateWorkExperienceInput>({
    resolver: zodResolver(generateWorkExperienceSchema),
    defaultValues: {
      description: "",
    },
  });

  const onSubmit = async (input: GenerateWorkExperienceInput) => {
    try {
      const workExperience = await generateWorkExperience(input);
      onWorkExperienceGenerated(workExperience);
    } catch (error) {
      console.error("Error generating work experience:", error);
      toast({
        title: "エラー",
        description: "職歴の生成に失敗しました。",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>職歴を生成</DialogTitle>
          <DialogDescription>
            この職歴について説明してください。AIが最適化されたエントリーを生成します。
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>説明</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder={`例: "2019年11月から2020年12月まで、Googleでソフトウェアエンジニアとして働きました。主な業務は..."`}
                      autoFocus
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <LoadingButton type="submit" loading={form.formState.isSubmitting}>
              生成
            </LoadingButton>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
