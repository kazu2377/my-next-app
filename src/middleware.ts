import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

// このミドルウェアは /administrators/* パスに対するアクセスを制御します
export function middleware(request: NextRequest) {
  console.log('ミドルウェア実行:', request.nextUrl.pathname);
  
  // ログイン画面へのアクセスはチェックしない
  if (request.nextUrl.pathname === '/administrators') {
    return NextResponse.next();
  }

  // ダッシュボードへの直接アクセスを許可
  if (request.nextUrl.pathname === '/administrators/dashboard') {
    return NextResponse.next();
  }
  
  // APIルートと特定のパターンはバイパス
  if (
    request.nextUrl.pathname.startsWith('/api/') ||
    request.nextUrl.pathname.includes('_next') ||
    request.nextUrl.pathname.includes('favicon.ico')
  ) {
    return NextResponse.next();
  }

  // URLにクエリパラメータ 'loggedIn=true' がある場合は認証OK
  // (ログイン後のリダイレクトの場合に使用)
  const url = new URL(request.url);
  if (url.searchParams.get('loggedIn') === 'true') {
    // クエリパラメータをクリーンアップするためにリダイレクト
    const cleanUrl = url.pathname;
    return NextResponse.redirect(new URL(cleanUrl, request.url));
  }

  // クッキーを確認（将来的なセキュリティ強化のための備え）
  const adminSession = request.cookies.get('adminSession')?.value;
  if (adminSession) {
    try {
      const session = JSON.parse(adminSession);
      const isValid = session.isLoggedIn && session.expires > Date.now();
      
      if (isValid) {
        return NextResponse.next();
      }
    } catch (error) {
      // JSONパースエラーなどがあればログイン画面へリダイレクト
      console.error('認証ミドルウェアエラー:', error);
    }
  }

  // ログイン画面へリダイレクト
  return NextResponse.redirect(new URL('/administrators', request.url));
}

// このミドルウェアは管理者関連パスのみに適用されます
export const config = {
  matcher: ['/administrators/dashboard/:path*']
}; 