import type { Metadata } from "next";
import "../styles/globals.css";
import BottomNav from "@/components/layout/BottomNav";
import { backupFromRedis } from "@/lib/redisBackup";
import Link from "next/link";

export const metadata: Metadata = {
  title: "수원FC 현장 가이드 - 축구 응원법 아카이브",
  description: "실전에서 바로 쓸 수 있는 수원FC 응원 가이드",
  icons: {
    icon: "/images/favicon.png",
    apple: "/images/apple-icon.png",
  },
  manifest: "/manifest.json",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // 서버 시작 시 레디스에서 데이터 백업
  await backupFromRedis();
  
  return (
    <html lang="ko" className="dark">
      <body className="max-w-md mx-auto min-h-screen bg-suwon-bgDark flex flex-col pb-20 shadow-2xl border-x border-suwon-blue/10">
        <header className="sticky top-0 z-50 bg-gradient-header backdrop-blur px-4 py-3 border-b border-suwon-red/30">
          <Link href="/" className="flex items-center gap-3">
            <img
              src="/images/suwonfc-logo-medium.png"
              alt="수원FC 로고"
              className="w-10 h-10"
            />
            <h1 className="text-h1 text-suwon-textPrimary font-bold">직관 응원 가이드</h1>
          </Link>
        </header>
        
        <main className="flex-1">{children}</main>
        
        <BottomNav />
      </body>
    </html>
  );
}