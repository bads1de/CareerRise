import { EditorFormProps } from "@/lib/types";
import GeneralInfoForm from "./forms/GeneralInfoForm";
import PersonalInfoForm from "./forms/PersonalInfoForm";
import WorkExperienceForm from "./forms/WorkExperienceForm";
import EducationForm from "./forms/EducationForm";
import SkillsForm from "./forms/SkillsForm";
import SummaryForm from "./forms/SummaryForm";

export const steps: {
  title: string;
  component: React.ComponentType<EditorFormProps>;
  key: string;
}[] = [
  { title: "基本情報", component: GeneralInfoForm, key: "general-info" },
  { title: "個人情報", component: PersonalInfoForm, key: "personal-info" },
  { title: "職歴", component: WorkExperienceForm, key: "work-experience" },
  { title: "学歴", component: EducationForm, key: "education" },
  { title: "スキル", component: SkillsForm, key: "skills" },
  { title: "概要", component: SummaryForm, key: "summary" },
];
