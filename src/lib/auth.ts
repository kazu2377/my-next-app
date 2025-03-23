'use server';

// サーバー側の認証関数
export async function verifyAdminCredentials(id: string, password: string) {
  
  // 環境変数から管理者IDとパスワードを取得
  const adminId = process.env.ADMIN_ID;
  const adminPassword = process.env.ADMIN_PASSWORD;
  
  // 認証チェック
  const isValid = (id === adminId && password === adminPassword);
  
  return {
    success: isValid,
    error: isValid ? undefined : '管理者IDまたはパスワードが正しくありません'
  };
} 