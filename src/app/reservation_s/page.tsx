import { ReservationType, supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Suspense } from "react";

// 環境変数から予約可能な日付と時間を取得する関数
function getAvailableDatesAndTimes() {
  try {
    // 環境変数から予約可能な日付と時間を取得
    const availableDatesStr = process.env.NEXT_PUBLIC_AVAILABLE_DATES || '[]';
    const availableTimesStr = process.env.NEXT_PUBLIC_AVAILABLE_TIMES || '[]';
    
    const availableDates = JSON.parse(availableDatesStr);
    const availableTimes = JSON.parse(availableTimesStr);
    
    return { availableDates, availableTimes };
  } catch (error) {
    console.error('環境変数の解析エラー:', error);
    return { availableDates: [], availableTimes: [] };
  }
}

// 予約可能な時間枠を生成する関数
function generateTimeSlots() {
  const { availableTimes } = getAvailableDatesAndTimes();
  
  // 環境変数に設定された時間がある場合はそれを使用
  if (availableTimes.length > 0) {
    return availableTimes;
  }
  
  // 環境変数に設定がない場合は、デフォルトの時間枠を生成
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

// 予約用データを取得する関数
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

// 予約済みの日付と時間のリストを取得する関数
async function getReservedDateTimes() {
  const reservations = await getReservations();
  return reservations.map(reservation => ({
    date: reservation.date,
    time: reservation.time
  }));
}

// 日付選択処理のサーバーアクション
async function selectDate(formData: FormData) {
  'use server';
  
  const date = formData.get('date') as string;
  if (date) {
    redirect(`/reservation_s?selectedDate=${encodeURIComponent(date)}`);
  } else {
    redirect('/reservation_s');
  }
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
    redirect(`/reservation_s?error=${encodeURIComponent('必須項目をすべて入力してください')}`);
    return;
  }
  
  // 予約可能な日付かどうかをチェック
  const { availableDates } = getAvailableDatesAndTimes();
  if (availableDates.length > 0 && !availableDates.includes(date)) {
    redirect(`/reservation_s?error=${encodeURIComponent('選択された日付は予約できません')}`);
    return;
  }
  
  // 予約済みの日時かどうかをチェックする
  const reservedDateTimes = await getReservedDateTimes();
  const isAlreadyReserved = reservedDateTimes.some(
    reservedDateTime => reservedDateTime.date === date && reservedDateTime.time === time
  );
  
  if (isAlreadyReserved) {
    // すでに予約済みの場合は処理を中断し、エラーメッセージを表示
    redirect(`/reservation_s?selectedDate=${encodeURIComponent(date)}&error=${encodeURIComponent('すでに予約されています。再度別な日時を選択してください。')}`);
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
    redirect(`/reservation_s?error=${encodeURIComponent('予約の保存中にエラーが発生しました')}`);
    return;
  }
  
  // ページを再検証して最新データを表示
  revalidatePath('/reservation_s');
  
  // 予約成功時に完了画面にリダイレクト
  redirect('/reservation_s/complete?name=' + encodeURIComponent(name) + '&date=' + encodeURIComponent(date) + '&time=' + encodeURIComponent(time));
}

// 

// 予約済み日時一覧表示コンポーネント
async function ReservedDatesList() {
  const reservedDateTimes = await getReservedDateTimes();
  
  // 日付ごとに予約時間をグループ化
  const groupedByDate = reservedDateTimes.reduce<Record<string, string[]>>((acc, { date, time }) => {
    if (!acc[date]) {
      acc[date] = [];
    }
    // 重複チェックを追加
    if (!acc[date].includes(time)) {
      acc[date].push(time);
    }
    return acc;
  }, {});
  
  return (
    <div className="mt-8 mb-8">
      <h2 className="text-xl font-semibold mb-4">予約済み日時</h2>
      {Object.keys(groupedByDate).length === 0 ? (
        <p>予約済みの日時はありません</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(groupedByDate).map(([date, times]) => (
            <div key={date} className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 className="font-medium">{date}</h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {times.map((time, index) => (
                  <span key={`${date}-${time}-${index}`} className="px-2 py-1 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100 text-xs rounded-full">
                    {time} 予約×
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// 利用可能な日付表示コンポーネント
function AvailableDatesList() {
  const { availableDates } = getAvailableDatesAndTimes();
  
  if (availableDates.length === 0) {
    return null;
  }
  
  return (
    <div className="mt-8 mb-8">
      <h2 className="text-xl font-semibold mb-4">予約可能な日付</h2>
      <div className="flex flex-wrap gap-2">
        {availableDates.map((date: string) => (
          <span key={date} className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 text-sm rounded-full">
            {date}
          </span>
        ))}
      </div>
    </div>
  );
}

// 予約フォームコンポーネント
async function ReservationForm({ searchParams }: { searchParams?: { selectedDate?: string, error?: string, success?: string } }) {
  // searchParamsの各プロパティを安全に取得
  const selectedDate = searchParams ? await Promise.resolve(searchParams.selectedDate || '') : '';
  const success = searchParams ? await Promise.resolve(searchParams.success) : undefined;
  const error = searchParams ? await Promise.resolve(searchParams.error) : undefined;
  
  const timeSlots = generateTimeSlots();
  const { availableDates } = getAvailableDatesAndTimes();
  const reservedDateTimes = await getReservedDateTimes();
  
  // 日付と時間の組み合わせが既に予約済みかチェックする関数
  const isDateTimeReserved = (date: string, time: string) => {
    return reservedDateTimes.some(
      reservedDateTime => reservedDateTime.date === date && reservedDateTime.time === time
    );
  };
  
  // 特定の日付で予約可能な時間枠を取得
  const getAvailableTimesForDate = (date: string) => {
    return timeSlots.filter((time: string) => !isDateTimeReserved(date, time));
  };
  
  // 選択された日付に応じて利用可能な時間のリスト
  const availableTimesForSelectedDate = selectedDate ? getAvailableTimesForDate(selectedDate) : timeSlots;
  
  return (
    <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">新規予約</h2>
      
      {success && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          予約が正常に完了しました。
        </div>
      )}
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      
      {/* 予約ステップの案内 */}
      <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900 rounded-lg border border-blue-200 dark:border-blue-800">
        <h3 className="text-md font-medium text-blue-800 dark:text-blue-200 mb-2">
          予約の手順
        </h3>
        <ol className="list-decimal pl-5 text-sm text-blue-700 dark:text-blue-300">
          <li className="mb-1"><strong>ステップ1:</strong> 予約したい日付を選択して「日付を確定」ボタンをクリックしてください</li>
          <li className="mb-1"><strong>ステップ2:</strong> お客様情報を入力してください</li>
          <li className="mb-1"><strong>ステップ3:</strong> 予約時間を選択して「予約する」ボタンをクリックしてください</li>
        </ol>
        {!selectedDate && (
          <div className="mt-3 text-sm font-medium text-red-600 dark:text-red-400 flex items-center">
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            最初に日付を選択してください！
          </div>
        )}
      </div>
      
      {/* 日付選択フォーム */}
      <form action={selectDate} className="mb-4">
        <div className="mb-4">
          <label htmlFor="date-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            日付を選択してください
          </label>
          <div className="flex mt-1">
            <select
              id="date-select"
              name="date"
              defaultValue={selectedDate}
              className="block w-full rounded-l-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="">日付を選択</option>
              {availableDates.map((date: string) => {
                // その日付で予約可能な時間枠がない場合は無効にする
                const availableTimes = getAvailableTimesForDate(date);
                const isDisabled = availableTimes.length === 0;
                
                return (
                  <option key={date} value={date} disabled={isDisabled}>
                    {date} {isDisabled ? '- 予約不可' : ''}
                  </option>
                );
              })}
            </select>
            <button
              type="submit"
              className="ml-2 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              日付を確定
            </button>
          </div>
        </div>
      </form>
      
      {/* 予約フォーム */}
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
            disabled={!selectedDate}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
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
            disabled={!selectedDate}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
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
            disabled={!selectedDate}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              日付 <span className="text-red-500">*</span>
            </label>
            <input
              type="hidden"
              id="date"
              name="date"
              value={selectedDate}
              required
            />
            <div className="mt-1 p-2 border border-gray-300 rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
              {selectedDate || '日付が選択されていません'}
            </div>
            {!selectedDate && (
              <p className="mt-1 text-xs text-red-500">
                上部で日付を選択してから予約してください
              </p>
            )}
          </div>
          
          <div>
            <label htmlFor="time" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              時間 <span className="text-red-500">*</span>
            </label>
            <select
              id="time"
              name="time"
              required
              disabled={!selectedDate}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">◯時間を選択してください</option>
              {selectedDate ? (
                // 選択された日付に対して予約可能な時間のみを表示
                availableTimesForSelectedDate.map((time: string) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))
              ) : null}
            </select>
            {selectedDate ? (
              availableTimesForSelectedDate.length === 0 ? (
                <p className="mt-1 text-xs text-red-500">
                  選択された日付の予約可能な時間枠はありません
                </p>
              ) : (
                <p className="mt-1 text-xs text-green-600 dark:text-green-400">
                  {availableTimesForSelectedDate.length}件の予約可能な時間枠があります
                </p>
              )
            ) : (
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                ※日付を先に選択すると、予約可能な時間のみ表示されます
              </p>
            )}
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
            disabled={!selectedDate}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
          ></textarea>
        </div>
        
        <div>
          <button
            type="submit"
            disabled={!selectedDate}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            予約する
          </button>
        </div>
      </form>
    </div>
  );
}

// メインのページコンポーネント
export default async function ReservationPage({
  searchParams
}: {
  searchParams?: Promise<{ selectedDate?: string, error?: string, success?: string }> 
}) {
  // searchParamsをawaitして解決
  const resolvedParams = searchParams ? await searchParams : {};
  
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 p-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        予約登録
      </h1>
      
      <AvailableDatesList />
      
      <Suspense fallback={<div>読み込み中...</div>}>
        <ReservedDatesList />
      </Suspense>
      
      <Suspense fallback={<div>フォームを読み込み中...</div>}>
        <ReservationForm searchParams={resolvedParams} />
      </Suspense>
    </div>
  );
}
