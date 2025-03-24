'use client'

import { useEffect, useState } from 'react'

interface LoadingModalProps {
  isOpen: boolean
  message: string
}

export function LoadingModal({ isOpen, message }: LoadingModalProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    // モーダル表示時にスクロールを無効化
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    }
    
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!mounted || !isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full text-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 dark:border-indigo-400 mb-4"></div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            処理中
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {message}
          </p>
        </div>
      </div>
    </div>
  )
} 