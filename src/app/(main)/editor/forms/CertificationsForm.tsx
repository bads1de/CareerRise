import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { EditorFormProps } from "@/lib/types";
import { certificationsSchema, CertificationsValues } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, X } from "lucide-react";
import { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";

export default function CertificationsForm({
  resumeData,
  setResumeData,
}: EditorFormProps) {
  const form = useForm<CertificationsValues>({
    resolver: zodResolver(certificationsSchema),
    defaultValues: {
      certifications: resumeData.certifications || [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "certifications",
  });

  useEffect(() => {
    const { unsubscribe } = form.watch(async (values) => {
      const isValid = await form.trigger();
      if (isValid) {
        setResumeData({
          ...resumeData,
          certifications: values.certifications,
        });
      }
    });

    return () => unsubscribe();
  }, [form, resumeData, setResumeData]);

  return (
    <div className="space-y-4">
      <Form {...form}>
        <form className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">資格・免許</h2>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => append("")}
            >
              <Plus className="mr-2 h-4 w-4" />
              追加
            </Button>
          </div>

          {fields.length === 0 && (
            <div className="rounded-md border border-dashed p-8 text-center">
              <p className="text-sm text-muted-foreground">
                資格・免許がありません。「追加」ボタンをクリックして追加してください。
              </p>
            </div>
          )}

          {fields.map((field, index) => (
            <FormField
              key={field.id}
              control={form.control}
              name={`certifications.${index}`}
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-2">
                    <FormControl>
                      <Input {...field} placeholder="資格・免許名" />
                    </FormControl>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => remove(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
        </form>
      </Form>
    </div>
  );
}
