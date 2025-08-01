import { Suspense } from 'react';
import { LoginClient } from '@/app/login/LoginClient';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

// Server Componentとして認証チェックを行う
async function getAuthStatus() {
  // サーバーサイドでの認証チェック
  // 実際の実装では、セッションやトークンをサーバーサイドで検証
  return {
    isAuthenticated: false, // 実際の認証ロジックに置き換え
  };
}

export default async function LoginPage() {
  const authStatus = await getAuthStatus();

  // 既にログインしている場合はダッシュボードにリダイレクト
  if (authStatus.isAuthenticated) {
    // サーバーサイドでのリダイレクト
    return null; // 実際の実装ではredirect()を使用
  }

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <LoginClient />
    </Suspense>
  );
}
