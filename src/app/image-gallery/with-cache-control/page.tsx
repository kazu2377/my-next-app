import Image from 'next/image'
import { Suspense } from 'react'
import CacheControlPanel from './cache-control-panel'

// 画像の型定義
interface ImageItem {
  id: string
  title: string
  url: string
  width: number
  height: number
}

// 異なるキャッシュ戦略を持つ画像を取得
async function fetchCachedImages() {
  const cacheOptions = [
    {
      id: 'no-cache',
      title: 'キャッシュなし (no-store)',
      cache: 'no-store' as const,
      description: '毎回新しいデータを取得します'
    },
    {
      id: 'short-cache',
      title: '短期キャッシュ (10秒)',
      revalidate: 10,
      description: '10秒間キャッシュされます'
    },
    {
      id: 'long-cache',
      title: '長期キャッシュ (force-cache)',
      cache: 'force-cache' as const,
      description: 'デフォルトの挙動。明示的に再検証されるまでキャッシュ'
    },
    {
      id: 'tagged-cache',
      title: 'タグ付きキャッシュ',
      tags: ['image-gallery'],
      description: 'タグによる選択的な再検証が可能'
    }
  ]
  
  // 実際のアプリでは各画像に異なるURLを使用するが、
  // デモのため同じURLを使用しても戦略が適用されることを示す
  const imageUrl = 'https://images.unsplash.com/photo-1682685797507-d44d838b0ac7'
  
  // 並行してすべての戦略で画像を取得
  const promises = cacheOptions.map(async option => {
    // 実際のAPIからデータを取得する代わりに、遅延をシミュレート
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // 本来はここでfetchImageDataを使用してAPIからデータを取得
    // 例: const data = await fetchImageData<ImageItem[]>(url, option)
    
    return {
      id: option.id,
      title: option.title,
      description: option.description,
      imageUrl,
      timestamp: new Date().toISOString() // 取得時刻を記録
    }
  })
  
  return Promise.all(promises)
}

// 画像を表示するコンポーネント
async function CachedImages() {
  const images = await fetchCachedImages()
  
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">キャッシュ戦略の異なる画像</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {images.map(image => (
          <div key={image.id} className="border rounded-lg overflow-hidden bg-white shadow-sm">
            <div className="relative h-48 w-full">
              <Image
                src={image.imageUrl}
                alt={image.title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            
            <div className="p-4 space-y-2">
              <h3 className="text-lg font-semibold">{image.title}</h3>
              <p className="text-sm text-gray-600">{image.description}</p>
              <p className="text-xs text-gray-500">取得時刻: {new Date(image.timestamp).toLocaleTimeString()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ローディング表示
function CachedImagesLoading() {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">キャッシュ戦略の異なる画像</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="border rounded-lg overflow-hidden bg-white shadow-sm">
            <div className="h-48 w-full bg-gray-200 animate-pulse" />
            <div className="p-4 space-y-2">
              <div className="h-6 w-2/3 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
              <div className="h-3 w-1/3 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function CacheControlPage() {
  return (
    <div className="container mx-auto px-4 py-16 space-y-12">
      <div>
        <h1 className="text-3xl font-bold">キャッシュ制御付き画像ギャラリー</h1>
        <p className="mt-2 text-lg text-gray-700">
          Next.js 14におけるさまざまなキャッシュ戦略を示します。
          リロードすると、キャッシュ戦略によって一部の画像が再取得され、一部はキャッシュから提供されます。
        </p>
      </div>
      
      {/* クライアントコンポーネント - キャッシュ制御パネル */}
      <CacheControlPanel />
      
      {/* サーバーコンポーネント - 並行して処理される画像取得 */}
      <Suspense fallback={<CachedImagesLoading />}>
        <CachedImages />
      </Suspense>
    </div>
  )
} 