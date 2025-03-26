'use client'

import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { clearCache } from './actions'

export default function CacheControlPanel() {
  const router = useRouter()
  const [isRevalidating, setIsRevalidating] = useState(false)
  
  // 完全にページをリロード
  const handleFullReload = () => {
    window.location.reload()
  }
  
  // Next.jsのクライアント側ナビゲーションでリフレッシュ
  const handleSoftReload = () => {
    router.refresh()
  }
  
  // サーバーアクションを使用してキャッシュをクリア
  const handleClearCache = async (tag?: string) => {
    setIsRevalidating(true)
    
    try {
      // 分離したサーバーアクションを呼び出し
      const result = await clearCache(tag)
      
      if (!result.success) {
        console.error('Failed to clear cache:', result.error)
      }
      
      // ページをリフレッシュ
      router.refresh()
    } catch (error) {
      console.error('Failed to clear cache:', error)
    } finally {
      setIsRevalidating(false)
    }
  }
  
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 space-y-4">
      <h3 className="text-lg font-semibold text-blue-800">キャッシュ制御パネル</h3>
      
      <p className="text-sm text-blue-700">
        以下のボタンを使用して、異なる方法でページのキャッシュを制御できます。
        キャッシュ戦略によって、画像の取得時刻が変わることを確認してください。
      </p>
      
      <div className="flex flex-wrap gap-4">
        <Button
          variant="outline"
          onClick={handleFullReload}
          className="bg-white"
        >
          完全リロード（ブラウザ）
        </Button>
        
        <Button
          variant="outline"
          onClick={handleSoftReload}
          className="bg-white"
        >
          ソフトリロード（Next.js）
        </Button>
        
        <Button
          variant="outline"
          onClick={() => handleClearCache()}
          disabled={isRevalidating}
          className="bg-white"
        >
          {isRevalidating ? 'クリア中...' : 'すべてのキャッシュをクリア'}
        </Button>
        
        <Button
          variant="outline"
          onClick={() => handleClearCache('image-gallery')}
          disabled={isRevalidating}
          className="bg-white"
        >
          {isRevalidating ? 'クリア中...' : 'タグ付きキャッシュのみクリア'}
        </Button>
      </div>
      
      <div className="text-xs text-blue-600 bg-blue-100 p-3 rounded">
        <p className="font-medium">キャッシュ戦略の説明:</p>
        <ul className="list-disc list-inside space-y-1 mt-1">
          <li><strong>キャッシュなし (no-store)</strong>: 毎回新しいデータを取得します</li>
          <li><strong>短期キャッシュ (10秒)</strong>: 10秒間データがキャッシュされます</li>
          <li><strong>長期キャッシュ (force-cache)</strong>: 再検証するまでキャッシュされ続けます</li>
          <li><strong>タグ付きキャッシュ</strong>: タグによる選択的な再検証が可能です</li>
        </ul>
      </div>
    </div>
  )
} 