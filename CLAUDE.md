# Development Guidelines

## Commands
- **Build**: `npm run build` - Next.js production build
- **Develop**: `npm run dev` - Start development server
- **Lint**: `npm run lint` - Run ESLint on codebase
- **Deploy**: `npm run deploy` - Deploy to Cloudflare
- **Preview**: `npm run preview` - Preview production build

## Code Style
- **Components**: Use functional components with TypeScript interfaces
- **Imports**: Use absolute imports with `@/` prefix
- **Typing**: Strong typing with TypeScript; prefer interfaces over types
- **Naming**: camelCase for variables/functions, PascalCase for components
- **Error Handling**: Early returns for errors; handle edge cases first
- **Server vs Client**: Minimize `use client` usage; prefer server components
- **Functions**: Use function keyword for pure functions; omit semicolons
- **Structure**: Components, subcomponents, helpers, static content, types

## Next.js Patterns
- Follow App Router conventions for routing and state management
- Use server actions for data mutations with proper error handling
- Implement responsive design with Tailwind CSS (mobile-first approach)
- Prioritize Web Vitals (LCP, CLS, FID)

## SPC採用LP作成プロンプト

### 基本要件
- 株式会社SPCの採用LPを制作
- ホームページ制作会社としての強みをアピール
- 採用活動支援ツールの専門性を強調
- モダンでクリエイティブなデザインを希望

### ページ構成案
1. ヘッダー
   - 会社ロゴ
   - キャッチコピー（「採用サイト制作が強いホームページ制作会社」など）
   - 主要ナビゲーション

2. メインビジュアル
   - 強力なビジュアルイメージ
   - 短く印象的なキャッチフレーズ
   - CTAボタン（「お問い合わせ」「事例を見る」など）

3. サービス紹介
   - 採用LP制作
   - 企業紹介動画制作
   - 採用ツール開発
   - 各サービスにアイコンと簡潔な説明

4. 制作プロセス
   - STEP1: 企画設計
   - STEP2: UI/UX設計
   - STEP3: 制作
   - STEP4: 公開・効果検証
   - 各ステップの詳細説明

5. 成功事例
   - クライアント企業ロゴ
   - 制作物のスクリーンショット
   - 達成したKPI（応募率向上など）

6. 会社情報
   - 所在地
   - 電話番号（03-6279-3013）
   - 営業時間（10:00~19:00 土日祝除く）

7. フッター
   - 著作権表記
   - プライバシーポリシーリンク

### デザイン指示
- カラーパレット: 企業カラーを基調に（青系を推奨）
- フォント: モダンなサンセリフフォント
- 画像: オフィス写真、制作風景、完成品サンプル
- インタラクション: スクロールアニメーション

### コンテンツ作成指示

1. キャッチコピー案:
   - 「企業の魅力を最大限に伝える採用サイトを制作」
   - 「採用活動を変える、デジタルツールのプロフェッショナル」

2. サービス説明文:
   「当社は採用LP制作に特化したホームページ制作会社です。
   企業の求める人材と、求職者の希望を的確につなぐ設計で、
   従来の採用活動を変革します。」

3. 制作プロセス説明:
   「徹底的なヒアリングから始まる当社の制作プロセスは、
   企業の独自性と求職者のニーズを分析し、
   最適な採用コミュニケーションツールを構築します」

4. CTA文章:
   - 「自社の魅力を伝える採用サイトを作りたい」
   - 「採用活動の効果を高めたい」
   - 「まずは成功事例を見てみる」

### 技術要件
- レスポンシブデザイン（PC/スマートフォン対応）
- 高速表示最適化
- SEO対策済み
- アクセス解析対応（Google Analytics）

### 差別化ポイント強調
- 採用活動に特化したノウハウ
- データに基づく効果的な設計
- 競合他社との比較表
- 制作実績の数字（例: 応募率200%向上など）