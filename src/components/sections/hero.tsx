'use client'

import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import Link from 'next/link'

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
      </div>
      
      <div className="container mx-auto px-4 py-24 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-8"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900">
            <span className="text-blue-600">採用サイト制作</span>で<br />
            企業の魅力を最大限に引き出す
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">
            採用活動を変える、デジタルツールのプロフェッショナル
          </p>

          <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
            <Button size="lg" asChild>
              <Link href="#contact">
                お問い合わせ
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="#cases">
                制作実績を見る
              </Link>
            </Button>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center"
          >
            <div className="p-6 rounded-lg bg-white/80 backdrop-blur shadow-sm">
              <h3 className="text-2xl font-bold text-blue-600">200%</h3>
              <p className="text-gray-600">応募率向上実績</p>
            </div>
            <div className="p-6 rounded-lg bg-white/80 backdrop-blur shadow-sm">
              <h3 className="text-2xl font-bold text-blue-600">100+</h3>
              <p className="text-gray-600">制作実績</p>
            </div>
            <div className="p-6 rounded-lg bg-white/80 backdrop-blur shadow-sm">
              <h3 className="text-2xl font-bold text-blue-600">98%</h3>
              <p className="text-gray-600">顧客満足度</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
} 