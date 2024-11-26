"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { steps } from "./steps";
import Breadcrumbs from "./Breadcrumbs";
import Footer from "./Footer";

export default function ResumeEditor() {
  const searchParams = useSearchParams();

  const currentStep = searchParams.get("step") || steps[0].key;

  const setStep = (key: string) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set("step", key);
    window.history.pushState(null, "", `?${newSearchParams.toString()}`);
  };

  const FormComponent = steps.find(
    (step) => step.key === currentStep,
  )?.component;

  return (
    <div className="flex grow flex-col">
      <header className="space-y-1.5 border-b px-3 py-5 text-center">
        <h1 className="text-xl font-bold">履歴書を作成</h1>
        <p className="text-sm text-muted-foreground">
          履歴書を作成してください。進捗は自動的に保存されます。
        </p>
      </header>

      <main className="relative grow">
        <div className="absolute bottom-0 top-0 flex w-full">
          <div className="w-full space-y-6 overflow-auto p-3 md:w-1/2">
            <Breadcrumbs currentStep={currentStep} setCurrentStep={setStep} />
            {FormComponent && <FormComponent />}
          </div>
          <div className="grow md:border-r" />
          <div className="hidden w-1/2 md:flex">right</div>
        </div>
      </main>

      <Footer
        currentStep={currentStep}
        setCurrentStep={setStep}
        showSmResumePreview={false}
        setShowSmResumePreview={() => {}}
        isSaving={false}
      />
    </div>
  );
}
