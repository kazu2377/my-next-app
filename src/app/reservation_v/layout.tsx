import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "予約システム",
  description: "オンライン予約システム",
};

export default function ReservationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white">
            予約システム
          </h1>
          <p className="mt-2 text-center text-gray-600 dark:text-gray-400">
            希望の日時を選択して予約してください
          </p>
        </header>
        <main>{children}</main>
        <footer className="mt-12 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>© {new Date().getFullYear()} 予約システム. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
} 