import { sendReservationConfirmation } from "@/lib/email";
import { ReservationType, supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { DateSelector } from "./components/DateSelector";
import { ReservationForm } from "./components/ReservationForm";

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
    redirect(`/reservation_v?selectedDate=${encodeURIComponent(date)}`);
  } else {
    redirect('/reservation_v');
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
    redirect(`/reservation_v?error=${encodeURIComponent('必須項目をすべて入力してください')}`);
    return;
  }
  
  // 予約可能な日付かどうかをチェック
  const { availableDates } = getAvailableDatesAndTimes();
  if (availableDates.length > 0 && !availableDates.includes(date)) {
    redirect(`/reservation_v?error=${encodeURIComponent('選択された日付は予約できません')}`);
    return;
  }
  
  // リアルタイムで最新の予約状況を直接データベースから取得
  const { data: latestReservations, error: fetchError } = await supabase
    .from('reservations')
    .select('*')
    .eq('date', date)
    .eq('time', time);
  
  if (fetchError) {
    console.error('予約データの取得エラー:', fetchError);
    redirect(`/reservation_v?error=${encodeURIComponent('予約状況の確認中にエラーが発生しました')}`);
    return;
  }
  
  // すでに予約済みの場合は処理を中断
  if (latestReservations && latestReservations.length > 0) {
    redirect(`/reservation_v?selectedDate=${encodeURIComponent(date)}&error=${encodeURIComponent('この日時はすでに予約されています。再度別な時間を選択してください。')}`);
    return;
  }
  
  // 新規予約情報を作成
  const newReservation = {
    name,
    phone,
    email,
    notes: notes || null,
    time,
    date
  };
  
  // 予約データを保存
  const { error } = await supabase
    .from('reservations')
    .insert([newReservation]);
  
  if (error) {
    // 競合エラー（同時に同じ時間枠に予約があった場合）
    if (error.code === '23505') { // PostgreSQLの一意性制約違反コード
      redirect(`/reservation_v?selectedDate=${encodeURIComponent(date)}&error=${encodeURIComponent('申し訳ありませんが、ちょうど今、他の方がこの日時を予約されました。別の時間を選択してください。')}`);
      return;
    }
    
    console.error('予約保存エラー:', error);
    redirect(`/reservation_v?error=${encodeURIComponent('予約の保存中にエラーが発生しました')}`);
    return;
  }
  
  // 予約確認メールを送信
  const emailResult = await sendReservationConfirmation({
    reservation: newReservation
  });
  
  if (!emailResult.success) {
    console.error('予約確認メール送信エラー:', emailResult.error);
    // メール送信に失敗しても予約自体は成功しているので、エラーログだけ記録
  }
  
  // ページを再検証して最新データを表示
  revalidatePath('/reservation_v');
  
  // 予約成功時に完了画面にリダイレクト
  redirect('/reservation_v/complete?name=' + encodeURIComponent(name) + '&date=' + encodeURIComponent(date) + '&time=' + encodeURIComponent(time));
}

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

// 予約フォームコンテナコンポーネント
async function ReservationFormContainer({ 
  searchParams 
}: { 
  searchParams?: { selectedDate?: string, error?: string, success?: string } | Promise<{ selectedDate?: string, error?: string, success?: string }>
}) {
  // searchParamsの各プロパティを安全に取得
  const resolvedParams = searchParams instanceof Promise ? await searchParams : searchParams || {};
  const selectedDate = resolvedParams.selectedDate || '';
  const error = resolvedParams.error;
  
  const timeSlots = generateTimeSlots();
  const { availableDates } = getAvailableDatesAndTimes();
  const reservedDateTimes = await getReservedDateTimes();
  
  // 選択された日付が予約可能か確認
  const isDateAvailable = availableDates.length === 0 || availableDates.includes(selectedDate);
  
  // 日時が予約済みかどうかチェックする関数
  const isDateTimeReserved = (date: string, time: string) => {
    return reservedDateTimes.some(dt => dt.date === date && dt.time === time);
  };
  
  // 選択された日付の利用可能時間枠を取得
  const availableTimesForDate = timeSlots.filter((time: string) => !isDateTimeReserved(selectedDate, time));
  
  if (!selectedDate || !isDateAvailable) {
    return (
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">日付を選択</h2>
        <Suspense fallback={<div>読み込み中...</div>}>
          <DateSelector 
            availableDates={availableDates} 
            onSelectDate={selectDate} 
          />
        </Suspense>
      </div>
    );
  }
  
  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">
          予約日: <span className="text-indigo-600 dark:text-indigo-400">{selectedDate}</span>
        </h2>
        <form action={selectDate}>
          <button
            type="submit"
            className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            別の日付を選択
          </button>
        </form>
      </div>

      {availableTimesForDate.length === 0 ? (
        <div className="p-4 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700 rounded-md text-yellow-700 dark:text-yellow-300">
          この日は予約可能な時間枠がありません。別の日付を選択してください。
        </div>
      ) : (
        <Suspense fallback={<div>読み込み中...</div>}>
          <ReservationForm
            selectedDate={selectedDate}
            availableTimes={availableTimesForDate}
            addReservation={addReservation}
            error={error}
          />
        </Suspense>
      )}
    </div>
  );
}

// メインページコンポーネント
export default async function ReservationPage({
  searchParams
}: {
  searchParams?: { selectedDate?: string, error?: string, success?: string } | Promise<{ selectedDate?: string, error?: string, success?: string }>
}) {
  return (
    <div className="space-y-6">
      <Suspense fallback={<div>予約一覧を読み込み中...</div>}>
        <ReservedDatesList />
      </Suspense>
      
      <AvailableDatesList />
      
      <ReservationFormContainer searchParams={searchParams} />
    </div>
  );
} 