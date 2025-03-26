'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled ? 'bg-white/80 backdrop-blur-md shadow-sm' : 'bg-transparent'
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-blue-600">SPC</span>
            <span className="text-sm font-medium text-gray-600">採用サイト制作の専門家</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <Link href="#services" className="text-gray-600 hover:text-blue-600 transition-colors">
              サービス
            </Link>
            <Link href="#process" className="text-gray-600 hover:text-blue-600 transition-colors">
              制作プロセス
            </Link>
            <Link href="#cases" className="text-gray-600 hover:text-blue-600 transition-colors">
              導入事例
            </Link>
            <Link href="#company" className="text-gray-600 hover:text-blue-600 transition-colors">
              会社情報
            </Link>
            <Button asChild>
              <Link href="#contact">お問い合わせ</Link>
            </Button>
          </nav>

          <Button variant="outline" className="md:hidden">
            <span className="sr-only">メニュー</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          </Button>
        </div>
      </div>
    </header>
  )
} 