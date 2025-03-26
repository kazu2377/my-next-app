'use client'

import { motion } from 'framer-motion'

const steps = [
  {
    number: '01',
    title: '企画設計',
    description: '企業の課題やニーズを深く理解し、最適な採用サイトの設計を行います。',
  },
  {
    number: '02',
    title: 'UI/UX設計',
    description: '求職者の行動分析に基づいた、使いやすく魅力的なインターフェースを設計します。',
  },
  {
    number: '03',
    title: '制作',
    description: 'モダンな技術とデザインで、企業の魅力を最大限に引き出すサイトを制作します。',
  },
  {
    number: '04',
    title: '公開・効果検証',
    description: 'サイト公開後も継続的な効果測定と改善提案を行い、採用成果の最大化を支援します。',
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
    },
  },
}

export function Process() {
  return (
    <section id="process" className="py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            制作プロセス
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            徹底的なヒアリングから始まる当社の制作プロセスは、
            企業の独自性と求職者のニーズを分析し、
            最適な採用コミュニケーションツールを構築します。
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {steps.map((step, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="relative"
            >
              <div className="bg-white rounded-lg p-6 shadow-sm h-full">
                <div className="text-4xl font-bold text-blue-600 mb-4">
                  {step.number}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-600">
                  {step.description}
                </p>
              </div>
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6 text-blue-600"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
                    />
                  </svg>
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
} 