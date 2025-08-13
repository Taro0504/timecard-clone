import { Suspense } from 'react';
import { DashboardClient } from './DashboardClient';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

// Server Componentとして認証チェックを行う
async function getAuthData() {
  // サーバーサイドでの認証チェック
  // 実際の実装では、セッションやトークンをサーバーサイドで検証
  return {
    isAuthenticated: true, // 実際の認証ロジックに置き換え
    user: null, // 実際のユーザー情報に置き換え
  };
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const authData = await getAuthData();

  if (!authData.isAuthenticated) {
    // サーバーサイドでのリダイレクト
    return null; // 実際の実装ではredirect()を使用
  }

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <DashboardClient authData={authData}>{children}</DashboardClient>
    </Suspense>
  );
}
