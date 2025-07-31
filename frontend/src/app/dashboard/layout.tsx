'use client';

import { useState, useEffect, memo } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { FaBars, FaBell, FaBuilding, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '@/contexts/AuthContext';
import { navigation, adminNavigation } from '@/lib/constants/navigation';
import { LoadingSpinner } from '@/components/dashboard/LoadingSpinner';
import { NavigationItemComponent } from '@/components/dashboard/NavigationItem';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

// ユーザー情報コンポーネント
const UserInfo = memo(
  ({
    user,
    onLogout,
  }: {
    user: { last_name?: string; full_name?: string; role?: string } | null;
    onLogout: () => void;
  }) => (
    <div className="flex items-center px-6 py-4 bg-gray-50 border-t border-gray-200">
      <div className="flex items-center">
        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
          <span className="text-white text-sm font-medium">
            {user?.last_name?.[0] || 'U'}
          </span>
        </div>
        <div className="ml-3 flex-1">
          <p className="text-sm font-medium text-gray-700">
            {user?.full_name || 'ユーザー'}
          </p>
          <p className="text-xs text-gray-500">
            {user?.role === 'admin' ? '管理者' : '正社員'}
          </p>
        </div>
        <button
          onClick={onLogout}
          className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          title="ログアウト"
        >
          <FaSignOutAlt className="text-sm" />
        </button>
      </div>
    </div>
  )
);

UserInfo.displayName = 'UserInfo';

// ヘッダーコンポーネント
const Header = memo(
  ({
    isSidebarOpen,
    setIsSidebarOpen,
    currentPageName,
    onLogout,
  }: {
    isSidebarOpen: boolean;
    setIsSidebarOpen: (open: boolean) => void;
    currentPageName: string;
    onLogout: () => void;
  }) => (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 lg:hidden"
          >
            <FaBars className="text-xl" />
          </button>
          <h1 className="ml-2 text-lg font-semibold text-gray-900 lg:ml-0">
            {currentPageName}
          </h1>
        </div>

        <div className="flex items-center space-x-4">
          <button className="p-2 rounded-lg text-gray-500 hover:bg-gray-100">
            <FaBell className="text-lg" />
          </button>

          <button
            onClick={onLogout}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors flex items-center"
          >
            <FaSignOutAlt className="mr-2" />
            ログアウト
          </button>
        </div>
      </div>
    </header>
  )
);

Header.displayName = 'Header';

// サイドバーコンポーネント
const Sidebar = memo(
  ({
    isSidebarOpen,
    setIsSidebarOpen,
    user,
    onLogout,
  }: {
    isSidebarOpen: boolean;
    setIsSidebarOpen: (open: boolean) => void;
    user: { last_name?: string; full_name?: string; role?: string } | null;
    onLogout: () => void;
  }) => {
    const pathname = usePathname();

    const isActive = (href: string) => {
      if (href === '/dashboard') {
        return pathname === href;
      }
      return pathname.startsWith(href);
    };

    return (
      <>
        {/* サイドバーオーバーレイ (モバイル) */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 z-40 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          >
            <div className="fixed inset-0 bg-gray-600 bg-opacity-75"></div>
          </div>
        )}

        {/* サイドバー */}
        <div
          className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:transform-none lg:relative lg:z-auto lg:flex lg:flex-col lg:min-h-screen ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex flex-col h-full">
            {/* ロゴ */}
            <div className="flex items-center px-6 py-4 bg-blue-600">
              <div className="flex items-center">
                <FaBuilding className="text-2xl text-white mr-3" />
                <h1 className="text-xl font-bold text-white">FunctionalLab</h1>
              </div>
            </div>

            {/* ナビゲーション */}
            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
              {navigation.map((item) => (
                <NavigationItemComponent
                  key={item.name}
                  item={item}
                  isActive={isActive(item.href)}
                  onClick={() => setIsSidebarOpen(false)}
                />
              ))}

              {/* 管理者メニュー（管理者のみ表示） */}
              {user?.role === 'admin' && (
                <div className="pt-4 mt-4 border-t border-gray-200">
                  <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    管理者メニュー
                  </p>
                  <div className="mt-2 space-y-1">
                    {adminNavigation.map((item) => (
                      <NavigationItemComponent
                        key={item.name}
                        item={item}
                        isActive={isActive(item.href)}
                        onClick={() => setIsSidebarOpen(false)}
                      />
                    ))}
                  </div>
                </div>
              )}
            </nav>

            {/* ユーザー情報 */}
            <UserInfo user={user} onLogout={onLogout} />
          </div>
        </div>
      </>
    );
  }
);

Sidebar.displayName = 'Sidebar';

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, isAuthenticated, isLoading } = useAuth();

  // 認証チェック
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  // ローディング中は何も表示しない
  if (isLoading) {
    return <LoadingSpinner />;
  }

  // 認証されていない場合は何も表示しない（リダイレクト中）
  if (!isAuthenticated) {
    return null;
  }

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('ログアウトエラー:', error);
    }
  };

  const currentPageName =
    navigation.find((item) => {
      if (item.href === '/dashboard') {
        return pathname === item.href;
      }
      return pathname.startsWith(item.href);
    })?.name ||
    adminNavigation.find((item) => pathname.startsWith(item.href))?.name ||
    'ダッシュボード';

  return (
    <div className="min-h-screen bg-gray-50 lg:flex">
      {/* サイドバー */}
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        user={user}
        onLogout={handleLogout}
      />

      {/* メインコンテンツ */}
      <div className="flex-1 lg:flex lg:flex-col">
        {/* ヘッダー */}
        <Header
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          currentPageName={currentPageName}
          onLogout={handleLogout}
        />

        {/* メインコンテンツエリア */}
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
