import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "予約管理システム",
  description: "Next.jsで作成された予約管理システムです",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 dark:bg-gray-900 dark:text-white min-h-screen`}
      >
        <header className="bg-white dark:bg-gray-800 shadow-sm">
          <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/" className="text-xl font-bold">予約システム</Link>
            <div className="flex gap-6">
              <Link href="/" className="hover:text-blue-500">Home</Link>
              <Link href="/about" className="hover:text-blue-500">About</Link>
              <Link href="/contact" className="hover:text-blue-500">Contact</Link>
              <Link href="/reservation_v" className="hover:text-blue-500">予約</Link>
              <Link href="/administrators" className="hover:text-blue-500">管理</Link>
            </div>
          </nav>
        </header>
        <main>{children}</main>
        <footer className="bg-white dark:bg-gray-800 shadow-inner mt-auto py-6">
          <div className="container mx-auto px-4 text-center text-sm">
            &copy; {new Date().getFullYear()} 予約管理システム. All rights reserved.
          </div>
        </footer>
      </body>
    </html>
  );
}
