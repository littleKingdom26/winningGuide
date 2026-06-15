import type { Metadata } from "next";
import "../styles/globals.css";
import BottomNav from "@/components/layout/BottomNav";

export const metadata: Metadata = {
  title: "수원FC 현장 가이드 - 축구 응원법 아카이브",
  description: "실전에서 바로 쓸 수 있는 수원FC 응원 가이드",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="dark">
      <body className="max-w-md mx-auto min-h-screen bg-suwon-bgDark flex flex-col pb-20 shadow-2xl border-x border-suwon-blue/10">
        <header className="sticky top-0 z-50 bg-gradient-to-r from-suwon-red to-suwon-navy backdrop-blur px-4 py-3 border-b border-suwon-red/30">
          <h1 className="text-h1 text-suwon-textPrimary font-bold">수원FC 현장 가이드</h1>
        </header>
        
        <main className="flex-1">{children}</main>
        
        <BottomNav />
      </body>
    </html>
  );
}