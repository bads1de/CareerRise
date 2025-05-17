import useDimensions from "@/hooks/useDimensions";
import { cn } from "@/lib/utils";
import { ResumeValues } from "@/lib/validation";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Badge } from "./ui/badge";
import { BorderStyles } from "@/app/(main)/editor/BorderStyleButton";

interface ResumePreviewProps {
  resumeData: ResumeValues;
  contentRef?: React.Ref<HTMLDivElement>;
  className?: string;
}

export default function ResumePreview({
  resumeData,
  contentRef,
  className,
}: ResumePreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { width } = useDimensions(containerRef);

  return (
    <div
      className={cn(
        "aspect-[210/297] h-fit w-full bg-white text-black",
        className,
      )}
      ref={containerRef}
    >
      <div
        className={cn("space-y-6 p-6", !width && "invisible")}
        style={{
          zoom: (1 / 794) * width,
        }}
        ref={contentRef}
        id="resumePreviewContent"
      >
        <PersonalInfoHeader resumeData={resumeData} />
        <SummarySection resumeData={resumeData} />
        <WorkExperienceSection resumeData={resumeData} />
        <EducationSection resumeData={resumeData} />
        <SkillsSection resumeData={resumeData} />
        <CertificationsSection resumeData={resumeData} />
      </div>
    </div>
  );
}

interface ResumeSectionProps {
  resumeData: ResumeValues;
}

function PersonalInfoHeader({ resumeData }: ResumeSectionProps) {
  const {
    photo,
    firstName,
    lastName,
    // jobTitle, // 現在未使用
    // city, // 現在未使用
    // country, // 現在未使用
    phone,
    email,
    // colorHex, // 現在未使用
    borderStyle,
    // 日本の履歴書用フィールド
    birthDate,
    gender,
    postalCode,
    address,
    nearestStation,
    maritalStatus,
    dependents,
    commuteTime,
    desiredPosition,
    desiredSalary,
    healthCondition,
  } = resumeData;

  const [photoSrc, setPhotoSrc] = useState(photo instanceof File ? "" : photo);

  useEffect(() => {
    const objectUrl = photo instanceof File ? URL.createObjectURL(photo) : "";
    if (objectUrl) setPhotoSrc(objectUrl);
    if (photo === null) setPhotoSrc("");
    return () => URL.revokeObjectURL(objectUrl);
  }, [photo]);

  const formatJapaneseDate = (date: Date | string | null | undefined) => {
    if (!date) return "";
    return format(
      typeof date === "string" ? new Date(date) : date,
      "yyyy年MM月dd日",
      { locale: ja },
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <div className="space-y-1">
          <h1 className="mb-4 text-center text-3xl font-bold">履歴書</h1>
          <p className="text-right text-sm">
            {formatJapaneseDate(new Date())} 現在
          </p>
        </div>
        {photoSrc && (
          <Image
            src={photoSrc}
            width={120}
            height={160}
            alt="証明写真"
            className="object-cover"
            style={{
              borderRadius:
                borderStyle === BorderStyles.SQUARE
                  ? "0px"
                  : borderStyle === BorderStyles.CIRCLE
                    ? "9999px"
                    : "4px",
              width: "120px",
              height: "160px",
            }}
          />
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <div className="mb-2 flex">
            <p className="w-24 font-bold">氏名</p>
            <p className="flex-1">
              {lastName} {firstName}
            </p>
          </div>
          {birthDate && (
            <div className="mb-2 flex">
              <p className="w-24 font-bold">生年月日</p>
              <p className="flex-1">{formatJapaneseDate(birthDate)}</p>
            </div>
          )}
          {gender && (
            <div className="mb-2 flex">
              <p className="w-24 font-bold">性別</p>
              <p className="flex-1">{gender}</p>
            </div>
          )}
          {address && (
            <div className="mb-2 flex">
              <p className="w-24 font-bold">住所</p>
              <div className="flex-1">
                {postalCode && <p>〒{postalCode}</p>}
                <p>{address}</p>
              </div>
            </div>
          )}
          {nearestStation && (
            <div className="mb-2 flex">
              <p className="w-24 font-bold">最寄り駅</p>
              <p className="flex-1">{nearestStation}</p>
            </div>
          )}
        </div>

        <div>
          {phone && (
            <div className="mb-2 flex">
              <p className="w-24 font-bold">電話番号</p>
              <p className="flex-1">{phone}</p>
            </div>
          )}
          {email && (
            <div className="mb-2 flex">
              <p className="w-24 font-bold">メール</p>
              <p className="flex-1">{email}</p>
            </div>
          )}
          {maritalStatus && (
            <div className="mb-2 flex">
              <p className="w-24 font-bold">配偶者</p>
              <p className="flex-1">{maritalStatus}</p>
            </div>
          )}
          {dependents !== undefined && dependents !== null && (
            <div className="mb-2 flex">
              <p className="w-24 font-bold">扶養家族</p>
              <p className="flex-1">{dependents}人</p>
            </div>
          )}
          {commuteTime !== undefined && commuteTime !== null && (
            <div className="mb-2 flex">
              <p className="w-24 font-bold">通勤時間</p>
              <p className="flex-1">約{commuteTime}分</p>
            </div>
          )}
        </div>
      </div>

      {(desiredPosition || desiredSalary || healthCondition) && (
        <div className="grid grid-cols-2 gap-4 border-t pt-2 text-sm">
          {desiredPosition && (
            <div className="mb-2 flex">
              <p className="w-24 font-bold">希望職種</p>
              <p className="flex-1">{desiredPosition}</p>
            </div>
          )}
          {desiredSalary && (
            <div className="mb-2 flex">
              <p className="w-24 font-bold">希望給与</p>
              <p className="flex-1">{desiredSalary}</p>
            </div>
          )}
          {healthCondition && (
            <div className="mb-2 flex">
              <p className="w-24 font-bold">健康状態</p>
              <p className="flex-1">{healthCondition}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function SummarySection({ resumeData }: ResumeSectionProps) {
  const { summary, motivation, colorHex } = resumeData;

  if (!summary && !motivation) return null;

  return (
    <>
      <hr
        className="border-2"
        style={{
          borderColor: colorHex,
        }}
      />
      <div className="break-inside-avoid space-y-3">
        {summary && (
          <>
            <p
              className="text-lg font-semibold"
              style={{
                color: colorHex,
              }}
            >
              自己PR
            </p>
            <div className="whitespace-pre-line text-sm">{summary}</div>
          </>
        )}

        {motivation && (
          <>
            <p
              className="mt-4 text-lg font-semibold"
              style={{
                color: colorHex,
              }}
            >
              志望動機
            </p>
            <div className="whitespace-pre-line text-sm">{motivation}</div>
          </>
        )}
      </div>
    </>
  );
}

function WorkExperienceSection({ resumeData }: ResumeSectionProps) {
  const { workExperiences, colorHex } = resumeData;

  const workExperiencesNotEmpty = workExperiences?.filter(
    (exp) => Object.values(exp).filter(Boolean).length > 0,
  );

  if (!workExperiencesNotEmpty?.length) return null;

  // 日本式の履歴書では古い順に表示
  const sortedExperiences = [...workExperiencesNotEmpty].sort((a, b) => {
    if (!a.startDate) return 1;
    if (!b.startDate) return -1;
    return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
  });

  const formatJapaneseDate = (date: Date | string | null | undefined) => {
    if (!date) return "";
    return format(
      typeof date === "string" ? new Date(date) : date,
      "yyyy年MM月",
      { locale: ja },
    );
  };

  return (
    <>
      <hr
        className="border-2"
        style={{
          borderColor: colorHex,
        }}
      />
      <div className="space-y-3">
        <p
          className="text-lg font-semibold"
          style={{
            color: colorHex,
          }}
        >
          職歴
        </p>
        <table className="w-full text-sm">
          <tbody>
            {sortedExperiences.map((exp, index) => (
              <tr key={index} className="break-inside-avoid">
                <td className="whitespace-nowrap py-1 pr-4 align-top">
                  {exp.startDate && (
                    <span>{formatJapaneseDate(exp.startDate)}</span>
                  )}
                </td>
                <td className="py-1 align-top">
                  <div className="space-y-1">
                    <p className="font-semibold">{exp.company}</p>
                    <p>{exp.position}</p>
                  </div>
                </td>
              </tr>
            ))}
            {sortedExperiences.length > 0 && (
              <tr>
                <td className="whitespace-nowrap py-1 pr-4 align-top">
                  {format(new Date(), "yyyy年MM月", { locale: ja })}
                </td>
                <td className="py-1 align-top">
                  <p>現在に至る</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

function EducationSection({ resumeData }: ResumeSectionProps) {
  const { educations, colorHex } = resumeData;

  const educationsNotEmpty = educations?.filter(
    (edu) => Object.values(edu).filter(Boolean).length > 0,
  );

  if (!educationsNotEmpty?.length) return null;

  // 日本式の履歴書では古い順に表示
  const sortedEducations = [...educationsNotEmpty].sort((a, b) => {
    if (!a.startDate) return 1;
    if (!b.startDate) return -1;
    return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
  });

  const formatJapaneseDate = (date: Date | string | null | undefined) => {
    if (!date) return "";
    return format(
      typeof date === "string" ? new Date(date) : date,
      "yyyy年MM月",
      { locale: ja },
    );
  };

  return (
    <>
      <hr
        className="border-2"
        style={{
          borderColor: colorHex,
        }}
      />
      <div className="space-y-3">
        <p
          className="text-lg font-semibold"
          style={{
            color: colorHex,
          }}
        >
          学歴
        </p>
        <table className="w-full text-sm">
          <tbody>
            {sortedEducations.map((edu, index) => (
              <tr key={index} className="break-inside-avoid">
                <td className="whitespace-nowrap py-1 pr-4 align-top">
                  {edu.startDate && (
                    <span>{formatJapaneseDate(edu.startDate)}</span>
                  )}
                </td>
                <td className="py-1 align-top">
                  <div className="space-y-1">
                    <p className="font-semibold">{edu.school}</p>
                    <p>{edu.degree}</p>
                  </div>
                </td>
              </tr>
            ))}
            {sortedEducations.length > 0 &&
              sortedEducations[sortedEducations.length - 1].endDate && (
                <tr>
                  <td className="whitespace-nowrap py-1 pr-4 align-top">
                    {formatJapaneseDate(
                      sortedEducations[sortedEducations.length - 1].endDate,
                    )}
                  </td>
                  <td className="py-1 align-top">
                    <p>卒業</p>
                  </td>
                </tr>
              )}
          </tbody>
        </table>
      </div>
    </>
  );
}

function SkillsSection({ resumeData }: ResumeSectionProps) {
  const { skills, colorHex, borderStyle } = resumeData;

  if (!skills?.length) return null;

  return (
    <>
      <hr
        className="border-2"
        style={{
          borderColor: colorHex,
        }}
      />
      <div className="break-inside-avoid space-y-3">
        <p
          className="text-lg font-semibold"
          style={{
            color: colorHex,
          }}
        >
          スキル
        </p>
        <div className="flex break-inside-avoid flex-wrap gap-2">
          {skills.map((skill, index) => (
            <Badge
              key={index}
              className="rounded-md bg-black text-white hover:bg-black"
              style={{
                backgroundColor: colorHex,
                borderRadius:
                  borderStyle === BorderStyles.SQUARE
                    ? "0px"
                    : borderStyle === BorderStyles.CIRCLE
                      ? "9999px"
                      : "8px",
              }}
            >
              {skill}
            </Badge>
          ))}
        </div>
      </div>
    </>
  );
}

function CertificationsSection({ resumeData }: ResumeSectionProps) {
  const { certifications, colorHex } = resumeData;

  if (!certifications?.length) return null;

  return (
    <>
      <hr
        className="border-2"
        style={{
          borderColor: colorHex,
        }}
      />
      <div className="break-inside-avoid space-y-3">
        <p
          className="text-lg font-semibold"
          style={{
            color: colorHex,
          }}
        >
          資格・免許
        </p>
        <div className="flex flex-col gap-1">
          {certifications.map((certification, index) => (
            <p key={index} className="text-sm">
              {certification}
            </p>
          ))}
        </div>
      </div>
    </>
  );
}
