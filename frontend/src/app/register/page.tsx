import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { RegisterClient } from '@/app/register/RegisterClient';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

// Server Componentとして認証チェックを行う
async function getAuthStatus() {
  // サーバーサイドでの認証チェック
  // 実際の実装では、セッションやトークンをサーバーサイドで検証
  return {
    isAuthenticated: false, // 実際の認証ロジックに置き換え
  };
}

export default async function RegisterPage() {
  const authStatus = await getAuthStatus();

  // 既にログインしている場合はダッシュボードにリダイレクト
  if (authStatus.isAuthenticated) {
    redirect('/dashboard');
  }

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <RegisterClient />
    </Suspense>
  );
}
