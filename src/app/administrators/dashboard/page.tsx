'use client';

import {
    addReservation,
    deleteReservation,
    getAllReservations,
    getReservationById,
    updateReservation
} from '@/lib/reservations';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

// 予約データの型定義
type Reservation = {
  id: number;
  name: string;
  phone: string;
  email: string;
  date: string;
  time: string;
  notes: string | null;
};

// レスポンスの型定義
type ActionResponse = {
  success: boolean;
  error?: string;
  data?: any;
};

export default function AdminDashboard() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [currentReservation, setCurrentReservation] = useState<Reservation | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const router = useRouter();

  // 空の予約フォームを用意
  const emptyReservation: Reservation = {
    id: 0,
    name: '',
    phone: '',
    email: '',
    date: '',
    time: '',
    notes: ''
  };

  // 管理者認証チェック
  useEffect(() => {
    console.log('認証チェック実行中...');
    checkAuthentication();
  }, []);

  // 認証チェック関数
  const checkAuthentication = () => {
    // ローカルストレージから認証情報を取得
    const adminSession = localStorage.getItem('adminSession');
    console.log('adminSession:', adminSession ? '存在します' : 'ありません');
    
    if (!adminSession) {
      console.log('セッションなし: ログイン画面へリダイレクト');
      window.location.href = '/administrators';
      return;
    }
    
    try {
      const session = JSON.parse(adminSession);
      const isValid = session.isLoggedIn && session.expires > Date.now();
      console.log('セッション有効:', isValid);
      
      if (!isValid) {
        console.log('セッション無効: ログイン画面へリダイレクト');
        localStorage.removeItem('adminSession');
        window.location.href = '/administrators';
        return;
      }
      
      setIsAuthenticated(true);
      // 予約データを取得
      fetchReservations();
    } catch (error) {
      console.log('セッション解析エラー:', error);
      localStorage.removeItem('adminSession');
      window.location.href = '/administrators';
    }
  };

  // 管理者ログアウト処理
  const handleLogout = () => {
    localStorage.removeItem('adminSession');
    window.location.href = '/administrators';
  };

  // 予約データを取得する関数
  const fetchReservations = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response: ActionResponse = await getAllReservations();
      
      if (response.success && response.data) {
        setReservations(response.data);
      } else {
        setError(response.error || '予約データの取得に失敗しました');
      }
    } catch (error) {
      console.error('予約データ取得エラー:', error);
      setError('予約データの取得中にエラーが発生しました');
    } finally {
      setIsLoading(false);
    }
  };

  // 予約削除処理
  const handleDelete = async (id: number) => {
    if (!window.confirm('この予約を削除してもよろしいですか？')) {
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);
    
    try {
      const response: ActionResponse = await deleteReservation(id.toString());
      
      if (response.success) {
        setSuccessMessage('予約が正常に削除されました');
        fetchReservations(); // 予約リストを再取得
      } else {
        setError(response.error || '予約の削除に失敗しました');
      }
    } catch (error) {
      console.error('予約削除エラー:', error);
      setError('予約の削除中にエラーが発生しました');
    } finally {
      setIsLoading(false);
    }
  };

  // 予約編集モードに切り替え
  const handleEdit = async (id: number) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response: ActionResponse = await getReservationById(id.toString());
      
      if (response.success && response.data) {
        setCurrentReservation(response.data);
        setIsEditing(true);
      } else {
        setError(response.error || '予約データの取得に失敗しました');
      }
    } catch (error) {
      console.error('予約データ取得エラー:', error);
      setError('予約データの取得中にエラーが発生しました');
    } finally {
      setIsLoading(false);
    }
  };

  // 予約更新処理
  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!currentReservation) return;
    
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);
    
    try {
      const formData = new FormData(e.currentTarget);
      
      // FormDataに予約IDを追加
      formData.append('id', currentReservation.id.toString());
      
      const response: ActionResponse = await updateReservation(formData);
      
      if (response.success) {
        setSuccessMessage('予約が正常に更新されました');
        setIsEditing(false);
        fetchReservations(); // 予約リストを再取得
      } else {
        setError(response.error || '予約の更新に失敗しました');
      }
    } catch (error) {
      console.error('予約更新エラー:', error);
      setError('予約の更新中にエラーが発生しました');
    } finally {
      setIsLoading(false);
    }
  };

  // 予約追加モードに切り替え
  const handleAddMode = () => {
    setCurrentReservation(emptyReservation);
    setIsAdding(true);
    setIsEditing(false);
  };

  // 予約追加処理
  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);
    
    try {
      const formData = new FormData(e.currentTarget);
      const response: ActionResponse = await addReservation(formData);
      
      if (response.success) {
        setSuccessMessage('予約が正常に追加されました');
        setIsAdding(false);
        fetchReservations(); // 予約リストを再取得
      } else {
        setError(response.error || '予約の追加に失敗しました');
      }
    } catch (error) {
      console.error('予約追加エラー:', error);
      setError('予約の追加中にエラーが発生しました');
    } finally {
      setIsLoading(false);
    }
  };

  // 編集/追加モードをキャンセル
  const handleCancel = () => {
    setIsEditing(false);
    setIsAdding(false);
    setError(null);
  };

  // 認証されていない場合はローディング表示
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-gray-600 dark:text-gray-300">認証を確認中...</p>
        </div>
      </div>
    );
  }

  // 予約フォームコンポーネント（編集・追加共通）
  const ReservationForm = () => {
    const isEdit = isEditing && !isAdding;
    const reservation = currentReservation || emptyReservation;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
          <h2 className="text-xl font-semibold mb-4">
            {isEdit ? '予約を編集' : '新規予約を追加'}
          </h2>
          
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}
          
          <form onSubmit={isEdit ? handleUpdate : handleAdd} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                名前 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                defaultValue={reservation.name}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                電話番号 <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                defaultValue={reservation.phone}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                メールアドレス <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                defaultValue={reservation.email}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                日付 <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="date"
                name="date"
                defaultValue={reservation.date}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            
            <div>
              <label htmlFor="time" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                時間 <span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                id="time"
                name="time"
                defaultValue={reservation.time}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                備考
              </label>
              <textarea
                id="notes"
                name="notes"
                defaultValue={reservation.notes || ''}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              ></textarea>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                キャンセル
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {isLoading ? '処理中...' : isEdit ? '更新する' : '追加する'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-16">
      {/* ヘッダー */}
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            予約管理システム
          </h1>
          <div>
            <button
              onClick={handleLogout}
              className="ml-2 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              ログアウト
            </button>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* 成功メッセージ表示 */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded flex justify-between items-center">
            <span>{successMessage}</span>
            <button
              onClick={() => setSuccessMessage(null)}
              className="text-green-700 hover:text-green-900"
            >
              ×
            </button>
          </div>
        )}
        
        {/* エラーメッセージ表示 */}
        {error && !isEditing && !isAdding && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded flex justify-between items-center">
            <span>{error}</span>
            <button
              onClick={() => setError(null)}
              className="text-red-700 hover:text-red-900"
            >
              ×
            </button>
          </div>
        )}
        
        {/* タイトルと新規追加ボタン */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            予約一覧
          </h2>
          <button
            onClick={handleAddMode}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            新規予約を追加
          </button>
        </div>
        
        {/* 予約リスト表示 */}
        {isLoading && reservations.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">データを読み込み中...</p>
          </div>
        ) : reservations.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow">
            <p className="text-gray-500 dark:text-gray-400">予約データがありません</p>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 shadow overflow-hidden rounded-lg">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      ID
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      名前
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      連絡先
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      日付
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      時間
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      備考
                    </th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                  {reservations.map((reservation) => (
                    <tr key={reservation.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {reservation.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {reservation.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        <div>{reservation.phone}</div>
                        <div className="text-xs">{reservation.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {reservation.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {reservation.time}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate">
                        {reservation.notes || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2 flex justify-center">
                        <button
                          onClick={() => handleEdit(reservation.id)}
                          className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                        >
                          編集
                        </button>
                        <button
                          onClick={() => handleDelete(reservation.id)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                        >
                          削除
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
      
      {/* 編集モードまたは追加モード時にフォームを表示 */}
      {(isEditing || isAdding) && <ReservationForm />}
    </div>
  );
} 