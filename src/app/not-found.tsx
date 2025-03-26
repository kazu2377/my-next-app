import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="max-w-md text-center">
        <h1 className="mb-4 text-6xl font-bold text-red-500">404</h1>
        <h2 className="mb-8 text-2xl font-medium">ページが見つかりません</h2>
        <p className="mb-8 text-gray-600">
          お探しのページは移動されたか、削除された可能性があります。
        </p>
        <Link 
          href="/"
          className="rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
        >
          ホームに戻る
        </Link>
      </div>
    </div>
  )
} 