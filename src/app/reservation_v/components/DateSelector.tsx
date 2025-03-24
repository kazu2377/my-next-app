'use client'

import { useState } from 'react'

interface DateSelectorProps {
  availableDates: string[]
  onSelectDate: (formData: FormData) => void
}

export function DateSelector({ availableDates, onSelectDate }: DateSelectorProps) {
  const [selectedDate, setSelectedDate] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDate(e.target.value)
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append('date', selectedDate)
    onSelectDate(formData)
  }

  // 日付が存在しない場合のメッセージ
  if (availableDates.length === 0) {
    return (
      <div className="p-4 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700 rounded-md text-yellow-700 dark:text-yellow-300">
        現在予約可能な日付はありません。後ほどご確認ください。
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <select
          name="date"
          value={selectedDate}
          onChange={handleChange}
          required
          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white"
        >
          <option value="">予約可能な日付を選択</option>
          {availableDates.map(date => (
            <option key={date} value={date}>
              {date}
            </option>
          ))}
        </select>
        <button
          type="submit"
          disabled={!selectedDate}
          className="sm:w-auto w-full py-2 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md transition duration-200 disabled:bg-indigo-400 disabled:cursor-not-allowed"
        >
          日付を選択
        </button>
      </div>
    </form>
  )
} 