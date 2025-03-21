import { ReservationType, supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";
import { Suspense } from "react";

// 予約可能な時間枠を生成する関数
function generateTimeSlots() {
  const slots: string[] = [];
  
  // 9:00-12:00
  for (let hour = 9; hour < 12; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
      slots.push(`${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`);
    }
  }
  
  // 13:00-18:00
  for (let hour = 13; hour < 18; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
      slots.push(`${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`);
    }
  }
  
  return slots;
}

// Supabaseから予約データを取得する関数
async function getReservations() {
  const { data, error } = await supabase
    .from('reservations')
    .select('*')
    .order('date', { ascending: true });
  
  if (error) {
    console.error('予約データの取得エラー:', error);
    return [];
  }
  
  return data as ReservationType[];
}

// 予約を追加するサーバーアクション
async function addReservation(formData: FormData) {
  'use server';
  
  const name = formData.get('name') as string;
  const phone = formData.get('phone') as string;
  const email = formData.get('email') as string;
  const notes = formData.get('notes') as string;
  const time = formData.get('time') as string;
  const date = formData.get('date') as string;
  
  if (!name || !phone || !email || !time || !date) {
    return;
  }
  
  const newReservation = {
    name,
    phone,
    email,
    notes: notes || null,
    time,
    date
  };
  
  // Supabaseに予約データを保存
  const { error } = await supabase
    .from('reservations')
    .insert([newReservation]);
  
  if (error) {
    console.error('予約保存エラー:', error);
    return;
  }
  
  // ページを再検証して最新データを表示
  revalidatePath('/reservation_s');
}

// 予約リスト表示コンポーネント
async function ReservationsList() {
  // Supabaseから予約データを取得
  const reservations = await getReservations();
  
  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">現在の予約一覧</h2>
      {reservations.length === 0 ? (
        <p>予約はまだありません</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-700">
                <th className="py-2 px-4 border-b">名前</th>
                <th className="py-2 px-4 border-b">電話番号</th>
                <th className="py-2 px-4 border-b">メールアドレス</th>
                <th className="py-2 px-4 border-b">日付</th>
                <th className="py-2 px-4 border-b">時間</th>
                <th className="py-2 px-4 border-b">備考</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((reservation) => (
                <tr key={reservation.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="py-2 px-4 border-b">{reservation.name}</td>
                  <td className="py-2 px-4 border-b">{reservation.phone}</td>
                  <td className="py-2 px-4 border-b">{reservation.email}</td>
                  <td className="py-2 px-4 border-b">{reservation.date}</td>
                  <td className="py-2 px-4 border-b">{reservation.time}</td>
                  <td className="py-2 px-4 border-b">{reservation.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// メインのページコンポーネント
export default function ReservationPage() {
  const timeSlots = generateTimeSlots();
  
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 p-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        予約管理システム
      </h1>
      
      <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">新規予約</h2>
        
        <form action={addReservation} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              名前 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              電話番号 <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              メールアドレス <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                日付 <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="date"
                name="date"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            
            <div>
              <label htmlFor="time" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                時間 <span className="text-red-500">*</span>
              </label>
              <select
                id="time"
                name="time"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="">時間を選択してください</option>
                {timeSlots.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              備考
            </label>
            <textarea
              id="notes"
              name="notes"
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            ></textarea>
          </div>
          
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              予約する
            </button>
          </div>
        </form>
      </div>
      
      <Suspense fallback={<div>読み込み中...</div>}>
        <ReservationsList />
      </Suspense>
    </div>
  );
}
