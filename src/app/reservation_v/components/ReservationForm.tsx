'use client'

import { useState, useTransition } from 'react'
import { LoadingModal } from './LoadingModal'

interface ReservationFormProps {
  selectedDate: string
  availableTimes: string[]
  addReservation: (formData: FormData) => Promise<void>
  error?: string
}

export function ReservationForm({
  selectedDate,
  availableTimes,
  addReservation,
  error
}: ReservationFormProps) {
  const [isSubmitting, startTransition] = useTransition()
  const [showModal, setShowModal] = useState(false)

  // フォーム送信処理
  const handleSubmit = (formData: FormData) => {
    if (isSubmitting) return // 2度押し防止

    // 必須フィールドのチェック
    const name = formData.get('name') as string
    const phone = formData.get('phone') as string
    const email = formData.get('email') as string
    const time = formData.get('time') as string

    if (!name || !phone || !email || !time) {
      return // フォームのバリデーションは HTML の required 属性に任せる
    }

    // モーダル表示
    setShowModal(true)

    // サーバーアクションを実行
    startTransition(async () => {
      try {
        await addReservation(formData)
      } catch (e) {
        console.error('予約処理エラー:', e)
        setShowModal(false)
      }
    })
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      {/* エラーメッセージ表示 */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-md text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">
        予約情報の入力
      </h2>

      <form action={handleSubmit}>
        <input type="hidden" name="date" value={selectedDate} />

        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            お名前 *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            電話番号 *
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            required
            pattern="[0-9\-]+"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            メールアドレス *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="time" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            予約時間 *
          </label>
          <select
            id="time"
            name="time"
            required
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white"
          >
            <option value="">時間を選択してください</option>
            {availableTimes.map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-6">
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            備考
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white"
          ></textarea>
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            disabled={isSubmitting}
            className="py-2 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md transition duration-200 disabled:bg-indigo-400 disabled:cursor-not-allowed"
          >
            {isSubmitting ? '処理中...' : '予約を確定する'}
          </button>
        </div>
      </form>

      {/* 処理中モーダル */}
      <LoadingModal
        isOpen={showModal}
        message="予約を処理中です。このままお待ちください..."
      />
    </div>
  )
} 