'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { motion } from 'framer-motion'

const cases = [
  {
    company: 'A社様',
    industry: 'IT・通信',
    result: '応募数200%増加',
    description: '採用サイトのリニューアルにより、エンジニア職への応募が大幅に増加。特に若手エンジニアからの応募が顕著に伸びました。',
    metrics: [
      { label: '応募数増加率', value: '200%' },
      { label: '採用コスト削減', value: '40%' },
      { label: '内定承諾率', value: '85%' },
    ],
  },
  {
    company: 'B社様',
    industry: '製造業',
    result: '採用コスト50%削減',
    description: '採用プロセスのデジタル化により、採用業務の効率が大幅に向上。人事担当者の工数削減と、応募者の利便性向上を実現しました。',
    metrics: [
      { label: '業務効率化', value: '60%' },
      { label: '採用コスト削減', value: '50%' },
      { label: '応募完了率', value: '95%' },
    ],
  },
  {
    company: 'C社様',
    industry: '小売業',
    result: '内定承諾率30%向上',
    description: '企業文化や職場の雰囲気を効果的に伝える動画コンテンツの導入により、ミスマッチが減少し、内定承諾率が向上しました。',
    metrics: [
      { label: '内定承諾率向上', value: '30%' },
      { label: '離職率低下', value: '45%' },
      { label: '動画視聴完了率', value: '80%' },
    ],
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
}

export function Cases() {
  return (
    <section id="cases" className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            導入事例
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            多くの企業様の採用課題を解決してきた実績があります。
            それぞれの企業様に最適なソリューションを提供し、
            採用活動の成果を最大化しています。
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {cases.map((case_, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card className="h-full">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-500">{case_.industry}</span>
                    <span className="text-sm font-medium text-blue-600">{case_.company}</span>
                  </div>
                  <CardTitle className="text-xl text-blue-600">{case_.result}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-6">{case_.description}</p>
                  <div className="grid grid-cols-3 gap-4">
                    {case_.metrics.map((metric, mIndex) => (
                      <div key={mIndex} className="text-center">
                        <div className="text-xl font-bold text-blue-600">{metric.value}</div>
                        <div className="text-sm text-gray-500">{metric.label}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
} 