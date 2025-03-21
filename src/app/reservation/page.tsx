"use client";
import { format, parse } from "date-fns";
import { ja } from "date-fns/locale";
import { useEffect, useState } from "react";

// 予約データの型定義
interface Reservation {
  id: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  startTime: string;
  endTime: string;
  notes: string;
}

// 時間枠の型定義
interface TimeSlot {
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  reservation?: Reservation;
}

const ReservationApp = () => {
  // 状態管理
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);
  const [formData, setFormData] = useState<Omit<Reservation, "id">>({
    name: "",
    email: "",
    phone: "",
    date: selectedDate,
    startTime: "",
    endTime: "",
    notes: "",
  });
  const [darkMode, setDarkMode] = useState<boolean | null>(null);
  // 環境変数から利用可能な日付と時間を取得
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);

  // 営業時間の設定
  const businessHours = {
    start: "09:00",
    end: "18:00",
    slotDuration: 30, // 分単位
  };

  // ページが最初に表示されたときに一度だけ実行される特別なお手伝いさん
  useEffect(() => {
    // あなたのパソコンが「暗い画面」が好きかどうかを確認するよ
    // 暗い画面が好きならtrue（はい）、明るい画面が好きならfalse（いいえ）になるよ
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(prefersDarkMode);
    
    // 環境変数から利用可能な日付と時間を取得
    try {
      const datesString = process.env.NEXT_PUBLIC_AVAILABLE_DATES || '[]';
      const timesString = process.env.NEXT_PUBLIC_AVAILABLE_TIMES || '[]';
      
      const dates = JSON.parse(datesString);
      const times = JSON.parse(timesString);
      
      setAvailableDates(dates);
      setAvailableTimes(times);
      
      // 利用可能な日付があれば、最初の日付を選択
      if (dates.length > 0) {
        setSelectedDate(dates[0]);
      } else {
        // 利用可能な日付がない場合は今日の日付を設定
        setSelectedDate(format(new Date(), "yyyy-MM-dd"));
      }
    } catch (error) {
      console.error("環境変数の解析エラー:", error);
      // エラーが発生した場合は今日の日付を設定
      setSelectedDate(format(new Date(), "yyyy-MM-dd"));
    }
  }, []);

  // 時間枠を生成する関数
  const generateTimeSlots = (date: string) => {
    const slots: TimeSlot[] = [];
    
    // 利用可能な時間がない場合は空の配列を返す
    if (availableTimes.length === 0) {
      return slots;
    }
    
    // 選択された日付が利用可能な日付にない場合は空の配列を返す
    if (availableDates.length > 0 && !availableDates.includes(date)) {
      return slots;
    }
    
    // 環境変数で指定された時間枠を使用
    for (let i = 0; i < availableTimes.length - 1; i++) {
      const startTime = availableTimes[i];
      const endTime = availableTimes[i + 1];
      
      // この時間枠に予約があるか確認
      const existingReservation = reservations.find(
        (r) => r.date === date && r.startTime === startTime
      );
      
      slots.push({
        startTime: startTime,
        endTime: endTime,
        isAvailable: !existingReservation,
        reservation: existingReservation,
      });
    }
    
    return slots;
  };

  // 日付変更時に時間枠を更新
  useEffect(() => {
    setTimeSlots(generateTimeSlots(selectedDate));
  }, [selectedDate, reservations, availableTimes, availableDates]);

  // ローカルストレージから予約データを読み込む
  useEffect(() => {
    const savedReservations = localStorage.getItem("reservations");
    if (savedReservations) {
      setReservations(JSON.parse(savedReservations));
    }
  }, []);

  // 予約データが変更されたらローカルストレージに保存
  useEffect(() => {
    if (reservations.length > 0) {
      localStorage.setItem("reservations", JSON.stringify(reservations));
    }
  }, [reservations]);

  // 時間枠をクリックしたときの処理
  const handleTimeSlotClick = (timeSlot: TimeSlot) => {
    if (timeSlot.isAvailable) {
      setSelectedTimeSlot(timeSlot);
      setFormData({
        ...formData,
        date: selectedDate,
        startTime: timeSlot.startTime,
        endTime: timeSlot.endTime,
      });
      setShowForm(true);
    } else {
      // 予約詳細を表示
      alert(`
        予約情報:
        名前: ${timeSlot.reservation?.name}
        メール: ${timeSlot.reservation?.email}
        電話: ${timeSlot.reservation?.phone}
        メモ: ${timeSlot.reservation?.notes || "なし"}
      `);
    }
  };

  // フォーム送信時の処理
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 新しい予約を作成
    const newReservation: Reservation = {
      id: Date.now().toString(),
      ...formData,
    };
    
    // 予約リストに追加
    setReservations([...reservations, newReservation]);
    
    // フォームをリセット
    setFormData({
      name: "",
      email: "",
      phone: "",
      date: selectedDate,
      startTime: "",
      endTime: "",
      notes: "",
    });
    
    setShowForm(false);
    setSelectedTimeSlot(null);
  };

  // 予約をキャンセルする処理
  const handleCancelReservation = (id: string) => {
    if (window.confirm("この予約をキャンセルしますか？")) {
      const updatedReservations = reservations.filter((r) => r.id !== id);
      setReservations(updatedReservations);
      
      // ローカルストレージも更新
      if (updatedReservations.length > 0) {
        localStorage.setItem("reservations", JSON.stringify(updatedReservations));
      } else {
        localStorage.removeItem("reservations");
      }
    }
  };

  // フォームの入力変更を処理
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // ダークモード切り替え
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // formatDate関数を修正して、クライアントサイドでのみ実行されるようにする
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = parse(dateString, "yyyy-MM-dd", new Date());
    return format(date, "yyyy年MM月dd日 (eee)", { locale: ja });
  };

  // 利用可能な日付かどうかを確認する関数
  const isDateAvailable = (dateString: string) => {
    return availableDates.length === 0 || availableDates.includes(dateString);
  };

  return (
    <div className={`min-h-screen ${darkMode === null ? "" : (darkMode ? "dark bg-gray-900 text-white" : "bg-gray-50 text-gray-900")}`}>
      {/* darkModeがnullの場合（初期レンダリング時）は何も表示しない */}
      {darkMode !== null && (
        <div className="container mx-auto p-4 max-w-4xl">
          {/* ヘッダー */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              予約管理システム
            </h1>
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full bg-gray-200 dark:bg-gray-700"
            >
              {darkMode ? "🌞" : "🌙"}
            </button>
          </div>

          {/* 日付選択 */}
          <div className="mb-6 bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
            <h2 className="text-lg font-medium mb-2 text-gray-700 dark:text-gray-300">
              日付を選択:
            </h2>
            <div className="flex flex-col items-start">
              {availableDates.length > 0 ? (
                <div className="space-y-2 w-full">
                  <select
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                  >
                    {availableDates.map((date) => (
                      <option key={date} value={date}>
                        {formatDate(date)}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="flex items-center">
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="border border-gray-300 dark:border-gray-600 rounded-md p-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                  />
                  <span className="ml-4 text-gray-600 dark:text-gray-400">
                    {formatDate(selectedDate)}
                  </span>
                </div>
              )}
              {availableDates.length > 0 && !isDateAvailable(selectedDate) && (
                <p className="text-red-500 mt-2">
                  この日付は予約できません。利用可能な日付を選択してください。
                </p>
              )}
            </div>
          </div>

          {/* 時間枠一覧 */}
          <div className="mb-6 bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
            <h2 className="text-lg font-medium mb-4 text-gray-700 dark:text-gray-300">
              予約状況:
            </h2>
            {timeSlots.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {timeSlots.map((slot, index) => (
                  <div
                    key={index}
                    onClick={() => handleTimeSlotClick(slot)}
                    className={`p-3 rounded-md text-center cursor-pointer transition-colors ${
                      slot.isAvailable
                        ? "bg-green-100 hover:bg-green-200 text-green-800 dark:bg-green-900 dark:hover:bg-green-800 dark:text-green-200"
                        : "bg-red-100 hover:bg-red-200 text-red-800 dark:bg-red-900 dark:hover:bg-red-800 dark:text-red-200"
                    }`}
                  >
                    <div className="font-medium">{slot.startTime} - {slot.endTime}</div>
                    <div className="text-xs mt-1">
                      {slot.isAvailable ? "予約可能" : slot.reservation?.name}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">
                {availableDates.length > 0 && !isDateAvailable(selectedDate)
                  ? "この日付は予約できません。"
                  : "この日に利用可能な時間枠はありません。"}
              </p>
            )}
          </div>

          {/* 予約フォーム */}
          {showForm && (
            <div className="mb-6 bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
              <h2 className="text-lg font-medium mb-4 text-gray-700 dark:text-gray-300">
                新規予約: {selectedTimeSlot?.startTime} - {selectedTimeSlot?.endTime}
              </h2>
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      お名前 *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      メールアドレス *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      電話番号 *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      備考
                    </label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 h-24"
                    ></textarea>
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setSelectedTimeSlot(null);
                    }}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                  >
                    キャンセル
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    予約する
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* 本日の予約一覧 */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
            <h2 className="text-lg font-medium mb-4 text-gray-700 dark:text-gray-300">
              {formatDate(selectedDate)}の予約一覧:
            </h2>
            {reservations.filter((r) => r.date === selectedDate).length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-900">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        時間
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        名前
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        連絡先
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        操作
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {reservations
                      .filter((r) => r.date === selectedDate)
                      .sort((a, b) => a.startTime.localeCompare(b.startTime))
                      .map((reservation) => (
                        <tr key={reservation.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                            {reservation.startTime} - {reservation.endTime}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                            {reservation.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                            <div>{reservation.email}</div>
                            <div>{reservation.phone}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <button
                              onClick={() => handleCancelReservation(reservation.id)}
                              className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                            >
                              キャンセル
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">予約はありません</p>
            )}
          </div>

          {/* フッター */}
          <div className="mt-12 text-center text-sm text-gray-500 dark:text-gray-400">
            <p>© 2025 予約管理システム - 簡単に予約を管理</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReservationApp; 