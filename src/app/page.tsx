import logo from "@/assets/logo.png";
import resumePreview from "@/assets/resume-preview.jpg";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-black px-5 py-12 text-center text-white md:flex-row md:text-start lg:gap-12">
      <div className="max-w-prose space-y-3">
        <Image
          src={logo}
          alt="Logo"
          width={150}
          height={150}
          className="mx-auto md:ms-0"
        />
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          <span className="inline-block bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent">
            完璧な履歴書
          </span>
          を 数分で作成
        </h1>
        <p className="text-lg text-gray-300">
          <span className="font-bold">CareerRise</span>で
          プロフェッショナルな履歴書を簡単に作成できます。
        </p>
        <Button asChild size="lg" variant="premium">
          <Link href="/resumes">作成を開始</Link>
        </Button>
      </div>
      <div className="overflow-hidden rounded-lg">
        <Image
          src={resumePreview}
          alt="Resume preview"
          width={600}
          className="shadow-2xl lg:rotate-[1.5deg]"
        />
      </div>
    </main>
  );
}
