import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Page() {
  return (
    <main className="mx-auto max-w-7xl space-y-6 px-3 py-6 text-center">
      <h1 className="text-3xl font-bold">請求成功</h1>
      <p>
        チェックアウトが成功し、Proアカウントが有効化されました。
        お楽しみください！
      </p>
      <Button asChild>
        <Link href="/resumes">履歴書へ移動</Link>
      </Button>
    </main>
  );
}
