'use client'

import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">株式会社SPC</h3>
            <p className="text-sm">
              採用サイト制作のプロフェッショナル
            </p>
          </div>

          <div>
            <h4 className="text-white font-medium mb-4">サービス</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#services" className="hover:text-white transition-colors">
                  採用LP制作
                </Link>
              </li>
              <li>
                <Link href="#services" className="hover:text-white transition-colors">
                  企業紹介動画制作
                </Link>
              </li>
              <li>
                <Link href="#services" className="hover:text-white transition-colors">
                  採用ツール開発
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-medium mb-4">会社情報</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#company" className="hover:text-white transition-colors">
                  会社概要
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-white transition-colors">
                  プライバシーポリシー
                </Link>
              </li>
              <li>
                <Link href="#contact" className="hover:text-white transition-colors">
                  お問い合わせ
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-medium mb-4">お問い合わせ</h4>
            <div className="space-y-2 text-sm">
              <p>電話: 03-6279-3013</p>
              <p>営業時間: 10:00~19:00</p>
              <p>（土日祝除く）</p>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} 株式会社SPC All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
} 