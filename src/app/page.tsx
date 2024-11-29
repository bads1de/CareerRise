"use client";

import logo from "@/assets/logo.png";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const features = [
  {
    title: "AIパワード",
    description: "最新のAI技術で、あなたの経歴を最大限魅力的に表現",
    icon: "✨",
  },
  {
    title: "プロフェッショナル",
    description: "採用担当者の目を引く洗練されたデザイン",
    icon: "🎯",
  },
  {
    title: "カスタマイズ自在",
    description: "豊富なテンプレートとカスタマイズオプション",
    icon: "🎨",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white">
      {/* ヒーローセクション */}
      <div className="container mx-auto px-4 py-20">
        <div className="flex flex-col items-center justify-between gap-12 md:flex-row">
          <motion.div
            className="max-w-xl space-y-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Image
              src={logo}
              alt="Logo"
              width={150}
              height={150}
              className="mx-auto md:mx-0"
            />
            <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl lg:text-6xl">
              <span className="inline-block bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                完璧な履歴書
              </span>
              <br />
              を数分で作成
            </h1>
            <p className="text-xl text-gray-300">
              <span className="font-bold">CareerRise</span>で
              プロフェッショナルな履歴書を簡単に作成できます。
              あなたのキャリアの次のステップを、私たちがサポートします。
            </p>
          </motion.div>
          <motion.div 
            whileHover={{ scale: 1.05 }} 
            whileTap={{ scale: 0.95 }}
            className="flex justify-center md:justify-end md:self-end md:pb-12"
          >
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-lg px-8 py-6 shadow-lg transition-all duration-300 hover:shadow-[0_0_30px_rgba(6,182,212,0.5)]"
            >
              <Link href="/resumes">無料で作成を開始</Link>
            </Button>
          </motion.div>
        </div>
      </div>

      {/* 特徴セクション */}
      <div className="container mx-auto px-4 py-20">
        <div className="grid gap-8 md:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className="rounded-xl border border-gray-800 bg-gray-900/50 p-6 backdrop-blur-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="mb-4 text-4xl">{feature.icon}</div>
              <h3 className="mb-2 text-xl font-bold">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
}
