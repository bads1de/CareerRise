import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FileUserIcon, PenLineIcon } from "lucide-react";
import Link from "next/link";
import { steps } from "./steps";

interface FooterProps {
  currentStep: string;
  setCurrentStep: (step: string) => void;
  showSmResumePreview: boolean;
  setShowSmResumePreview: (show: boolean) => void;
  isSaving: boolean;
}

export default function Footer({
  currentStep,
  setCurrentStep,
  showSmResumePreview,
  setShowSmResumePreview,
  isSaving,
}: FooterProps) {
  const previousStep = steps.find(
    (_, index) => steps[index + 1]?.key === currentStep,
  )?.key;

  const nextStep = steps.find(
    (_, index) => steps[index - 1]?.key === currentStep,
  )?.key;

  return (
    <footer className="w-full border-t px-3 py-5">
      <div className="mx-auto flex max-w-7xl flex-wrap justify-between gap-3">
        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            onClick={
              previousStep ? () => setCurrentStep(previousStep) : undefined
            }
            disabled={!previousStep}
          >
            前のステップ
          </Button>
          <Button
            onClick={nextStep ? () => setCurrentStep(nextStep) : undefined}
            disabled={!nextStep}
          >
            次のステップ
          </Button>
        </div>
        <Button
          variant="outline"
          className={cn("gap-2 sm:hidden", {
            "bg-accent": showSmResumePreview,
          })}
          onClick={() => setShowSmResumePreview(!showSmResumePreview)}
        >
          {showSmResumePreview ? (
            <>
              <PenLineIcon />
              編集に戻る
            </>
          ) : (
            <>
              <FileUserIcon />
              プレビュー
            </>
          )}
        </Button>
        <div className="flex items-center gap-3">
          <Button variant="secondary" asChild>
            <Link href="/resumes">閉じる</Link>
          </Button>
          <Button disabled={isSaving}>
            {isSaving ? (
              <>
                <span className="animate-spin">⏳</span>
                保存中...
              </>
            ) : (
              "保存"
            )}
          </Button>
        </div>
      </div>
    </footer>
  );
}
