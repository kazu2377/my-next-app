'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { motion } from 'framer-motion'

const companyInfo = {
  name: '株式会社SPC',
  address: '東京都千代田区...',
  phone: '03-6279-3013',
  hours: '10:00~19:00（土日祝除く）',
  description: `
    採用サイト制作のプロフェッショナルとして、
    企業の採用活動をデジタルの力でサポートします。
    私たちは、技術力とクリエイティビティを駆使して、
    企業と求職者の最適なマッチングを実現します。
  `,
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.5,
    },
  },
}

export function Company() {
  return (
    <section id="company" className="py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            会社情報
          </h2>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-center text-blue-600">
                {companyInfo.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <p className="text-gray-600 text-center whitespace-pre-line">
                  {companyInfo.description}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">所在地</h3>
                    <p className="text-gray-900">{companyInfo.address}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">電話番号</h3>
                    <p className="text-gray-900">{companyInfo.phone}</p>
                  </div>
                  <div className="md:col-span-2">
                    <h3 className="text-sm font-medium text-gray-500 mb-1">営業時間</h3>
                    <p className="text-gray-900">{companyInfo.hours}</p>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                    <div>
                      <h3 className="text-4xl font-bold text-blue-600">100+</h3>
                      <p className="text-sm text-gray-500">制作実績</p>
                    </div>
                    <div>
                      <h3 className="text-4xl font-bold text-blue-600">98%</h3>
                      <p className="text-sm text-gray-500">顧客満足度</p>
                    </div>
                    <div>
                      <h3 className="text-4xl font-bold text-blue-600">10年</h3>
                      <p className="text-sm text-gray-500">業界経験</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  )
} 