'use client';

import { verifyAdminCredentials } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { FormEvent, useEffect, useState } from 'react';

export default function AdminLoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  
  // コンポーネントマウント時に既にログイン済みかチェック
  useEffect(() => {
    const adminSession = localStorage.getItem('adminSession');
    
    if (adminSession) {
      try {
        const session = JSON.parse(adminSession);
        if (session.isLoggedIn && session.expires > Date.now()) {
          // 既にログイン済みであればダッシュボードにリダイレクト
          console.log('既存のセッションを検出、ダッシュボードへリダイレクト');
          window.location.href = '/administrators/dashboard?loggedIn=true';
        }
      } catch (error) {
        // JSONパースエラーなどの場合は無視
        localStorage.removeItem('adminSession');
      }
    }
  }, [router]);
  
  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    const formData = new FormData(e.currentTarget);
    const id = formData.get('id') as string;
    const password = formData.get('password') as string;
    
    try {
      const result = await verifyAdminCredentials(id, password);
      
      if (!result.success) {
        setError(result.error || '認証に失敗しました');
        setIsLoading(false);
      } else {
        // 認証成功時にセッション情報をローカルストレージに保存
        localStorage.setItem('adminSession', JSON.stringify({
          isLoggedIn: true,
          expires: Date.now() + 30 * 60 * 1000 // 30分後に期限切れ
        }));
        
        console.log('ログイン成功、ダッシュボードへリダイレクト...');
        
        // アンカータグでリダイレクト試行（別の方法）
        const a = document.createElement('a');
        a.href = '/administrators/dashboard?loggedIn=true';
        a.click();
        
        // バックアップとして少し遅延させてwindow.locationを使用
        setTimeout(() => {
          window.location.href = '/administrators/dashboard?loggedIn=true';
        }, 100);
      }
    } catch (error) {
      console.error('ログイン処理中にエラー:', error);
      setError('ログイン処理中にエラーが発生しました');
      setIsLoading(false);
    }
  }
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
        管理者ログイン
      </h1>
      
      <div className="w-full max-w-md mx-auto bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
        {error && (
          <div className="mb-6 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="id" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              管理者ID
            </label>
            <input
              type="text"
              id="id"
              name="id"
              required
              autoComplete="username"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="管理者IDを入力"
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              パスワード
            </label>
            <input
              type="password"
              id="password"
              name="password"
              required
              autoComplete="current-password"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="パスワードを入力"
            />
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'ログイン中...' : 'ログイン'}
          </button>
        </form>
      </div>
    </div>
  );
} 