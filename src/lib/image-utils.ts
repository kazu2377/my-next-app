/**
 * 画像取得とキャッシュ管理のためのユーティリティ関数
 */

type CacheOption = 'force-cache' | 'no-store' | 'no-cache' | 'reload'
type RevalidateOption = number | false

interface FetchImageOptions {
  cache?: CacheOption
  revalidate?: RevalidateOption
  tags?: string[]
}

/**
 * 外部APIから画像データをフェッチする関数
 * キャッシュ戦略を制御できる
 */
export async function fetchImageData<T>(
  url: string,
  options: FetchImageOptions = {}
): Promise<T> {
  const { cache = 'force-cache', revalidate, tags } = options
  
  const fetchOptions: RequestInit & { next?: { revalidate?: RevalidateOption, tags?: string[] } } = {
    cache,
    next: {}
  }
  
  // revalidateオプションがある場合はnextオブジェクトに追加
  if (revalidate !== undefined) {
    fetchOptions.next.revalidate = revalidate
  }
  
  // tagsオプションがある場合はnextオブジェクトに追加
  if (tags && tags.length > 0) {
    fetchOptions.next.tags = tags
  }
  
  const response = await fetch(url, fetchOptions)
  
  if (!response.ok) {
    throw new Error(`Failed to fetch image data: ${response.status}`)
  }
  
  return response.json() as Promise<T>
}

/**
 * 画像のキャッシュをタグに基づいて再検証する
 */
export async function revalidateImageCache(tag: string): Promise<void> {
  try {
    // この部分はサーバーアクションなどから呼び出される
    // 例: revalidatePath()やrevalidateTag()を使用
    // Next.js 14のAPI参照
    // await revalidateTag(tag)
    console.log(`Revalidating cache for tag: ${tag}`)
  } catch (error) {
    console.error('Failed to revalidate cache:', error)
    throw error
  }
}

/**
 * 画像の最適化設定を生成する
 */
export function getImageConfig(priority: boolean = false) {
  return {
    priority,
    loading: priority ? 'eager' : 'lazy',
    sizes: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  }
} 