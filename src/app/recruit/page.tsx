'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function RecruitPage() {
  const [activeSection, setActiveSection] = useState('');
  const [scrolled, setScrolled] = useState(false);

  // スクロール位置に基づいてアクティブセクションを設定
  useEffect(() => {
    const handleScroll = () => {
      // スクロール位置が100px以上ならヘッダーの背景色を変更
      if (window.scrollY > 100) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }

      // 各セクションの位置を取得してアクティブセクションを判定
      const sections = ['service', 'process', 'cases', 'contact'];
      let current = '';

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          // 画面の1/3より上にセクションがあればアクティブに
          if (rect.top <= window.innerHeight / 3) {
            current = section;
          }
        }
      }

      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll);
    // 初期化時に一度実行
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // ナビゲーションリンクのクラスを動的に設定
  const getLinkClass = (section) => {
    return activeSection === section 
      ? "text-blue-600 font-medium hover:text-blue-700 transition-colors"
      : "text-gray-600 hover:text-blue-600 transition-colors";
  };

  return (
    <div className="min-h-screen">
      {/* スティッキーヘッダー */}
      <header className={`sticky top-0 z-50 ${scrolled ? 'bg-white/95 shadow-md' : 'bg-transparent'} backdrop-blur-sm py-4 transition-all duration-300`}>
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center">
            <div className="text-2xl font-bold text-blue-600">SPC</div>
            <div className="ml-4 text-sm text-gray-600 hidden md:block">採用サイト制作が強いホームページ制作会社</div>
          </div>
          <nav>
            <ul className="flex space-x-6">
              <li><Link href="#service" className={getLinkClass('service')}>サービス</Link></li>
              <li><Link href="#process" className={getLinkClass('process')}>制作プロセス</Link></li>
              <li><Link href="#cases" className={getLinkClass('cases')}>事例</Link></li>
              <li><Link href="#contact" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">お問い合わせ</Link></li>
            </ul>
          </nav>
        </div>
      </header>
      
      {/* モバイル用フローティングメニュー（画面下部固定） */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-50 py-2">
        <div className="container mx-auto px-4">
          <ul className="flex justify-between">
            <li className="flex-1 text-center">
              <Link 
                href="#service" 
                className={`block p-2 text-xs ${activeSection === 'service' ? 'text-blue-600 font-medium' : 'text-gray-600'}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mx-auto mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                サービス
              </Link>
            </li>
            <li className="flex-1 text-center">
              <Link 
                href="#process" 
                className={`block p-2 text-xs ${activeSection === 'process' ? 'text-blue-600 font-medium' : 'text-gray-600'}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mx-auto mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                プロセス
              </Link>
            </li>
            <li className="flex-1 text-center">
              <Link 
                href="#cases" 
                className={`block p-2 text-xs ${activeSection === 'cases' ? 'text-blue-600 font-medium' : 'text-gray-600'}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mx-auto mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                事例
              </Link>
            </li>
            <li className="flex-1 text-center">
              <Link 
                href="#contact" 
                className={`block p-2 text-xs ${activeSection === 'contact' ? 'bg-blue-700' : 'bg-blue-600'} text-white rounded-md`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mx-auto mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                お問い合わせ
              </Link>
            </li>
          </ul>
        </div>
      </div>
      
      {/* ページトップへ戻るボタン */}
      <div className={`fixed bottom-20 right-4 z-50 transition-opacity duration-300 ${scrolled ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
          aria-label="トップへ戻る"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      </div>

      {/* メインビジュアル */}
      <section className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">企業の魅力を最大限に伝える採用サイトを制作</h1>
            <p className="text-xl mb-8">採用活動を変える、デジタルツールのプロフェッショナル</p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link href="#contact" className="bg-white text-blue-600 px-6 py-3 rounded-md font-semibold text-center hover:bg-gray-100 transition">
                お問い合わせ
              </Link>
              <Link href="#cases" className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-md font-semibold text-center hover:bg-white hover:text-blue-600 transition">
                事例を見る
              </Link>
            </div>
          </div>
          <div className="md:w-1/2">
            <div className="bg-white p-2 rounded-lg shadow-lg">
              <div className="aspect-w-16 aspect-h-9 bg-gray-200 rounded relative h-64">
                {/* 画像はpublicディレクトリに配置することを想定 */}
                <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                  制作風景イメージ
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* サービス紹介 */}
      <section id="service" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">サービス紹介</h2>
          <p className="text-center text-lg max-w-3xl mx-auto mb-16">
            当社は採用LP制作に特化したホームページ制作会社です。
            企業の求める人材と、求職者の希望を的確につなぐ設計で、
            従来の採用活動を変革します。
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* サービス1 */}
            <div className="bg-white p-8 rounded-lg shadow-md transform transition-transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-6 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-center mb-4">採用LP制作</h3>
              <p className="text-gray-600 text-center">
                企業の魅力を最大限に引き出し、応募を促進する魅力的な採用LPを制作します。
              </p>
            </div>

            {/* サービス2 */}
            <div className="bg-white p-8 rounded-lg shadow-md transform transition-transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-6 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-center mb-4">企業紹介動画制作</h3>
              <p className="text-gray-600 text-center">
                会社の雰囲気や社員の声を伝える魅力的な企業紹介動画を企画から制作まで対応します。
              </p>
            </div>

            {/* サービス3 */}
            <div className="bg-white p-8 rounded-lg shadow-md transform transition-transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-6 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-center mb-4">採用ツール開発</h3>
              <p className="text-gray-600 text-center">
                採用活動をサポートするカスタムツールやシステムの開発で、効率的な採用プロセスを実現します。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 制作プロセス */}
      <section id="process" className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">制作プロセス</h2>
          <p className="text-center text-lg max-w-3xl mx-auto mb-16">
            徹底的なヒアリングから始まる当社の制作プロセスは、
            企業の独自性と求職者のニーズを分析し、
            最適な採用コミュニケーションツールを構築します
          </p>
          
          <div className="max-w-4xl mx-auto">
            {/* STEP1 */}
            <div className="flex flex-col md:flex-row items-center mb-12">
              <div className="md:w-1/4 mb-6 md:mb-0">
                <div className="w-20 h-20 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto">
                  STEP1
                </div>
              </div>
              <div className="md:w-3/4 md:pl-8">
                <h3 className="text-xl font-semibold mb-3">企画設計</h3>
                <p className="text-gray-600">
                  貴社の採用ニーズや課題、競合状況などを徹底的にヒアリングし、最適な戦略を策定します。
                  ターゲット層を明確にし、効果的なメッセージングを考案します。
                </p>
              </div>
            </div>

            {/* STEP2 */}
            <div className="flex flex-col md:flex-row items-center mb-12">
              <div className="md:w-1/4 mb-6 md:mb-0">
                <div className="w-20 h-20 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto">
                  STEP2
                </div>
              </div>
              <div className="md:w-3/4 md:pl-8">
                <h3 className="text-xl font-semibold mb-3">UI/UX設計</h3>
                <p className="text-gray-600">
                  求職者の行動心理を考慮したUI/UX設計を行い、情報を最適に配置します。
                  直感的な操作性と魅力的なデザインで応募までの導線を最適化します。
                </p>
              </div>
            </div>

            {/* STEP3 */}
            <div className="flex flex-col md:flex-row items-center mb-12">
              <div className="md:w-1/4 mb-6 md:mb-0">
                <div className="w-20 h-20 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto">
                  STEP3
                </div>
              </div>
              <div className="md:w-3/4 md:pl-8">
                <h3 className="text-xl font-semibold mb-3">制作</h3>
                <p className="text-gray-600">
                  モダンな技術を活用し、レスポンシブで高速表示に最適化されたサイトを制作します。
                  SEO対策も考慮し、検索エンジンからの流入も促進します。
                </p>
              </div>
            </div>

            {/* STEP4 */}
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/4 mb-6 md:mb-0">
                <div className="w-20 h-20 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto">
                  STEP4
                </div>
              </div>
              <div className="md:w-3/4 md:pl-8">
                <h3 className="text-xl font-semibold mb-3">公開・効果検証</h3>
                <p className="text-gray-600">
                  サイト公開後も継続的にデータを分析し、改善提案を行います。
                  A/Bテストなどを活用し、常に最適なパフォーマンスを維持します。
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 成功事例 */}
      <section id="cases" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">成功事例</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* 事例1 */}
            <div className="bg-white rounded-lg overflow-hidden shadow-md">
              <div className="h-48 bg-gray-200 flex items-center justify-center text-gray-400">
                制作物のスクリーンショット
              </div>
              <div className="p-6">
                <div className="text-gray-500 text-sm mb-2">IT企業</div>
                <h3 className="text-xl font-semibold mb-2">A社採用サイトリニューアル</h3>
                <p className="text-gray-600 mb-4">
                  従来の採用サイトをフルリニューアルし、応募率を200%向上させました。
                </p>
                <div className="flex items-center text-blue-600">
                  <span className="text-sm font-semibold">詳細を見る</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>

            {/* 事例2 */}
            <div className="bg-white rounded-lg overflow-hidden shadow-md">
              <div className="h-48 bg-gray-200 flex items-center justify-center text-gray-400">
                制作物のスクリーンショット
              </div>
              <div className="p-6">
                <div className="text-gray-500 text-sm mb-2">製造業</div>
                <h3 className="text-xl font-semibold mb-2">B社新卒採用動画制作</h3>
                <p className="text-gray-600 mb-4">
                  工場のリアルな雰囲気を伝える動画制作により、応募者の職場イメージのミスマッチを50%削減。
                </p>
                <div className="flex items-center text-blue-600">
                  <span className="text-sm font-semibold">詳細を見る</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>

            {/* 事例3 */}
            <div className="bg-white rounded-lg overflow-hidden shadow-md">
              <div className="h-48 bg-gray-200 flex items-center justify-center text-gray-400">
                制作物のスクリーンショット
              </div>
              <div className="p-6">
                <div className="text-gray-500 text-sm mb-2">サービス業</div>
                <h3 className="text-xl font-semibold mb-2">C社採用管理システム開発</h3>
                <p className="text-gray-600 mb-4">
                  採用フローを一元管理するシステムを開発し、採用業務の工数を30%削減しました。
                </p>
                <div className="flex items-center text-blue-600">
                  <span className="text-sm font-semibold">詳細を見る</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* クライアントロゴ */}
          <div className="mt-16">
            <h3 className="text-xl font-semibold text-center mb-8">主要取引先</h3>
            <div className="flex flex-wrap justify-center gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="w-32 h-16 bg-white rounded-md shadow-sm flex items-center justify-center text-gray-400">
                  Logo {i}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 差別化ポイント */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">選ばれる理由</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* ポイント1 */}
            <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-600">
              <h3 className="text-xl font-semibold mb-3">採用活動に特化したノウハウ</h3>
              <p className="text-gray-600">
                一般的なホームページ制作とは異なる、採用活動特有の課題やニーズに精通したノウハウを持っています。
              </p>
            </div>

            {/* ポイント2 */}
            <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-600">
              <h3 className="text-xl font-semibold mb-3">データに基づく効果的な設計</h3>
              <p className="text-gray-600">
                過去の事例や市場調査から得られたデータを基に、効果的な採用サイトの設計と制作を行います。
              </p>
            </div>

            {/* ポイント3 */}
            <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-600">
              <h3 className="text-xl font-semibold mb-3">採用効果を向上させる総合力</h3>
              <p className="text-gray-600">
                サイト制作だけでなく、採用戦略の立案から効果検証まで一貫してサポートします。
              </p>
            </div>

            {/* ポイント4 */}
            <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-600">
              <h3 className="text-xl font-semibold mb-3">最新技術を活用した表現力</h3>
              <p className="text-gray-600">
                モダンな技術を活用し、魅力的で高機能な採用サイトを構築します。
              </p>
            </div>
          </div>

          {/* 比較表 */}
          <div className="mt-16 max-w-4xl mx-auto">
            <h3 className="text-xl font-semibold text-center mb-8">他社との比較</h3>
            <div className="overflow-x-auto">
              <table className="w-full bg-white shadow-lg rounded-lg overflow-hidden">
                <thead className="bg-blue-600 text-white">
                  <tr>
                    <th className="py-3 px-4 text-left">サービス内容</th>
                    <th className="py-3 px-4 text-center">SPC</th>
                    <th className="py-3 px-4 text-center">一般的な制作会社</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-3 px-4">採用に特化した設計</td>
                    <td className="py-3 px-4 text-center text-green-600">◎</td>
                    <td className="py-3 px-4 text-center text-gray-600">△</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4">採用動向データ分析</td>
                    <td className="py-3 px-4 text-center text-green-600">◎</td>
                    <td className="py-3 px-4 text-center text-gray-600">×</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4">採用効果測定</td>
                    <td className="py-3 px-4 text-center text-green-600">◎</td>
                    <td className="py-3 px-4 text-center text-gray-600">△</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4">採用管理ツール連携</td>
                    <td className="py-3 px-4 text-center text-green-600">◎</td>
                    <td className="py-3 px-4 text-center text-gray-600">×</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4">採用担当者向けサポート</td>
                    <td className="py-3 px-4 text-center text-green-600">◎</td>
                    <td className="py-3 px-4 text-center text-gray-600">△</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* CTAセクション */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">採用活動の効果を高めませんか？</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            自社の魅力を伝える採用サイトを作りたい方、採用活動の効果を高めたい方は、
            まずはお気軽にご相談ください。
          </p>
          <Link href="#contact" className="inline-block bg-white text-blue-600 px-8 py-4 rounded-md font-semibold text-lg hover:bg-gray-100 transition">
            無料相談のお申し込み
          </Link>
        </div>
      </section>

      {/* お問い合わせ */}
      <section id="contact" className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">お問い合わせ</h2>
          
          <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-8">
              <form>
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">会社名</label>
                    <input
                      type="text"
                      id="company"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="例：株式会社SPC"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">お名前</label>
                    <input
                      type="text"
                      id="name"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="例：山田 太郎"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">メールアドレス</label>
                    <input
                      type="email"
                      id="email"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="例：info@example.com"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="tel" className="block text-sm font-medium text-gray-700 mb-1">電話番号</label>
                    <input
                      type="tel"
                      id="tel"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="例：03-1234-5678"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">お問い合わせ内容</label>
                    <textarea
                      id="message"
                      rows={5}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="ご質問やご相談内容をご記入ください"
                    ></textarea>
                  </div>
                  
                  <div>
                    <button
                      type="submit"
                      className="w-full bg-blue-600 text-white py-3 px-4 rounded-md font-semibold hover:bg-blue-700 transition"
                    >
                      送信する
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
          
          {/* 会社情報 */}
          <div className="mt-16 max-w-3xl mx-auto">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-6">会社情報</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-24 font-medium">所在地</div>
                  <div>東京都千代田区○○町1-2-3 ○○ビル5F</div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-24 font-medium">電話番号</div>
                  <div>03-6279-3013</div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-24 font-medium">営業時間</div>
                  <div>10:00~19:00 土日祝除く</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* フッター */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <div className="text-2xl font-bold">SPC</div>
              <div className="text-sm text-gray-400 mt-1">採用サイト制作のプロフェッショナル</div>
            </div>
            <nav>
              <ul className="flex flex-wrap justify-center gap-x-8 gap-y-2">
                <li><Link href="#service" className="text-gray-300 hover:text-white">サービス</Link></li>
                <li><Link href="#process" className="text-gray-300 hover:text-white">制作プロセス</Link></li>
                <li><Link href="#cases" className="text-gray-300 hover:text-white">事例</Link></li>
                <li><Link href="#contact" className="text-gray-300 hover:text-white">お問い合わせ</Link></li>
                <li><Link href="#" className="text-gray-300 hover:text-white">プライバシーポリシー</Link></li>
              </ul>
            </nav>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
            &copy; 2025 株式会社SPC All Rights Reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}