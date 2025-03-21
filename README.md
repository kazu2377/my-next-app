# 予約管理システム

このプロジェクトはNext.jsで作成された予約管理システムです。

## Supabaseのセットアップ

1. [Supabase](https://supabase.com/)でアカウントを作成し、新しいプロジェクトを作成します。

2. プロジェクト作成後、SQL Editorで以下のSQLを実行して必要なテーブルを作成します:

```sql
CREATE TABLE reservations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  notes TEXT,
  time TEXT NOT NULL,
  date TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- インデックスの作成
CREATE INDEX idx_reservations_date ON reservations(date);
```

3. プロジェクトの設定ページから、`Project URL`と`anon public key`を取得します。

4. プロジェクトのルートディレクトリに`.env.local`ファイルを作成し、以下の内容を追加します:

```
NEXT_PUBLIC_SUPABASE_URL=あなたのプロジェクトURL
NEXT_PUBLIC_SUPABASE_ANON_KEY=あなたの匿名キー
```

## 開発環境の起動

```bash
npm run dev
```

## ビルドと本番環境での実行

```bash
npm run build
npm start
```

## 機能

- 9時〜18時（12時〜13時を除く）の15分毎の予約
- 名前、電話番号、メールアドレス、備考欄の入力
- Supabaseを使用したデータ保存

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
