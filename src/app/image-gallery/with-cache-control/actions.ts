'use server'

import { revalidatePath, revalidateTag } from 'next/cache'

/**
 * キャッシュをクリアするサーバーアクション
 * 別ファイルに分離して、クライアントコンポーネントでも利用可能にする
 */
export async function clearCache(tag?: string) {
  try {
    if (tag) {
      // 特定のタグを持つキャッシュを再検証
      console.log(`Revalidating tag: ${tag}`)
      revalidateTag(tag)
    } else {
      // 現在のページパスを再検証
      console.log('Revalidating path: /image-gallery/with-cache-control')
      revalidatePath('/image-gallery/with-cache-control')
    }
    return { success: true }
  } catch (error) {
    console.error('Failed to clear cache:', error)
    return { success: false, error: 'キャッシュのクリアに失敗しました' }
  }
} 