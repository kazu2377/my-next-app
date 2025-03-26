import Image from 'next/image'
import Link from 'next/link'
import { Suspense } from 'react'

// 外部画像のリストを取得するAPIの模擬関数（実際はデータベースなどから取得）
async function fetchImagesFromAPI() {
  // API呼び出しを模擬
  await new Promise(resolve => setTimeout(resolve, 2000))
  
  return [
    {
      id: '1',
      title: '風景写真1',
      url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
      width: 1200,
      height: 800
    },
    {
      id: '2',
      title: '風景写真2',
      url: 'https://images.unsplash.com/photo-1532274402911-5a369e4c4bb5',
      width: 1200,
      height: 800
    },
    {
      id: '3',
      title: '風景写真3',
      url: 'https://images.unsplash.com/photo-1501854140801-50d01698950b',
      width: 1200,
      height: 800
    }
  ]
}

// 内部画像のメタデータを取得する関数
async function fetchLocalImages() {
  // データベースからの取得を模擬
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  return [
    {
      id: 'local1',
      title: 'Next.jsロゴ',
      path: '/next.svg',
      width: 180,
      height: 37
    },
    {
      id: 'local2',
      title: 'Vercelロゴ',
      path: '/vercel.svg',
      width: 180,
      height: 37
    }
  ]
}

// APIから取得した画像を表示するコンポーネント
async function RemoteImages() {
  // fetch APIを使用する場合はキャッシュオプションを指定できる
  const images = await fetchImagesFromAPI()
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">リモート画像</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {images.map(image => (
          <div key={image.id} className="space-y-2">
            <div className="relative h-64 w-full overflow-hidden rounded-lg">
              {/* remote画像 - キャッシュ戦略を指定 */}
              <Image
                src={image.url}
                alt={image.title}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover"
                priority={image.id === '1'} // 最初の画像は優先的に読み込む
                loading={image.id === '1' ? 'eager' : 'lazy'} // LCPの最適化
              />
            </div>
            <p className="text-sm font-medium">{image.title}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// ローカル画像を表示するコンポーネント
async function LocalImages() {
  const images = await fetchLocalImages()
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">ローカル画像</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {images.map(image => (
          <div key={image.id} className="space-y-2 flex flex-col items-center">
            {/* local画像 - すでに最適化されている */}
            <Image
              src={image.path}
              alt={image.title}
              width={image.width}
              height={image.height}
              className="dark:invert"
            />
            <p className="text-sm font-medium">{image.title}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// ローディング表示コンポーネント
function ImageSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-8 w-36 rounded-md bg-gray-200 animate-pulse" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="space-y-2">
            <div className="h-64 w-full rounded-lg bg-gray-200 animate-pulse" />
            <div className="h-4 w-24 rounded-md bg-gray-200 animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  )
}

function LocalImageSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-8 w-36 rounded-md bg-gray-200 animate-pulse" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2].map(i => (
          <div key={i} className="space-y-2 flex flex-col items-center">
            <div className="h-10 w-40 rounded bg-gray-200 animate-pulse" />
            <div className="h-4 w-24 rounded-md bg-gray-200 animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  )
}

export default function ImageGalleryPage() {
  return (
    <div className="container mx-auto px-4 py-16 space-y-12">
      <h1 className="text-3xl font-bold">画像ギャラリー</h1>
      <p className="text-lg text-gray-700">
        Next.js 14の並行レンダリングとキャッシュ戦略を活用した画像ギャラリーです。
        各画像の読み込みは独立しており、異なるデータソースから並行してフェッチされます。
      </p>
      
      {/* ナビゲーションリンク */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Link 
          href="/image-gallery" 
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-center"
        >
          標準ギャラリー
        </Link>
        <Link 
          href="/image-gallery/with-cache-control" 
          className="px-4 py-2 bg-white border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition-colors text-center"
        >
          キャッシュ制御ギャラリー
        </Link>
      </div>
      
      <div className="space-y-12">
        {/* リモート画像セクション - 読み込み中はスケルトン表示 */}
        <Suspense fallback={<ImageSkeleton />}>
          <RemoteImages />
        </Suspense>
        
        {/* ローカル画像セクション - 読み込み中はスケルトン表示 */}
        <Suspense fallback={<LocalImageSkeleton />}>
          <LocalImages />
        </Suspense>
      </div>
    </div>
  )
} 