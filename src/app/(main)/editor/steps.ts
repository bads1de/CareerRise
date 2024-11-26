import { EditorFormProps } from "@/lib/types";
import GeneralInfoForm from "./forms/GeneralInfoForm";
import PersonalInfoForm from "./forms/PersonalInfoForm";

export const steps: {
  title: string;
  component: React.ComponentType<EditorFormProps>;
  key: string;
}[] = [
  { title: "基本情報", component: GeneralInfoForm, key: "general-info" },
  { title: "個人情報", component: PersonalInfoForm, key: "personal-info" },
];
