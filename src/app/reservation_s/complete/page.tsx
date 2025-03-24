import Link from 'next/link';

// 予約完了ページ
export default async function ReservationCompletePage({
  searchParams,
}: {
  searchParams: Promise<{ name?: string; date?: string; time?: string }>;
}) {
  // searchParamsをawaitしてから使用
  const resolvedParams = await searchParams;
  
  // URLパラメータから予約情報を取得
  const name = resolvedParams.name || '';
  const date = resolvedParams.date || '';
  const time = resolvedParams.time || '';

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 p-8">
      <div className="max-w-md mx-auto bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md text-center">
        <div className="mb-6">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto">
            <svg
              className="w-8 h-8 text-green-600 dark:text-green-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          予約が完了しました
        </h1>
        
        <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="mb-3 text-left">
            <p className="text-sm text-gray-500 dark:text-gray-400">お名前</p>
            <p className="font-medium text-gray-900 dark:text-white">{name}</p>
          </div>
          
          <div className="mb-3 text-left">
            <p className="text-sm text-gray-500 dark:text-gray-400">予約日</p>
            <p className="font-medium text-gray-900 dark:text-white">{date}</p>
          </div>
          
          <div className="text-left">
            <p className="text-sm text-gray-500 dark:text-gray-400">予約時間</p>
            <p className="font-medium text-gray-900 dark:text-white">{time}</p>
          </div>
        </div>
        
        <div className="flex items-center justify-center mb-6 p-3 bg-blue-50 dark:bg-blue-900 rounded-lg text-blue-700 dark:text-blue-300">
          <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <p className="text-sm">
            予約確認メールをお送りしましたので、ご確認ください。受信トレイとスパムフォルダをご確認ください。
          </p>
        </div>
        
        <Link
          href="/reservation_s"
          className="inline-block py-2 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md transition duration-200"
        >
          予約一覧に戻る
        </Link>
      </div>
    </div>
  );
}