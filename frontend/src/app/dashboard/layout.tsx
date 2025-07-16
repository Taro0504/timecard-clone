'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  FaHome,
  FaUser,
  FaClock,
  FaMoneyBill,
  FaBriefcase,
  FaCalendarAlt,
  FaFileAlt,
  FaUsers,
  FaCheckCircle,
  FaCog,
  FaBars,
  FaBell,
  FaBuilding,
  FaSignOutAlt,
} from 'react-icons/fa';
import { useAuth } from '@/contexts/AuthContext';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

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
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">読み込み中...</p>
        </div>
      </div>
    );
  }

  // 認証されていない場合は何も表示しない（リダイレクト中）
  if (!isAuthenticated) {
    return null;
  }

  // ナビゲーション項目
  const navigation = [
    {
      name: 'ダッシュボード',
      href: '/dashboard',
      icon: FaHome,
    },
    {
      name: 'マイページ',
      href: '/dashboard/mypage',
      icon: FaUser,
    },
    {
      name: '勤怠管理',
      href: '/dashboard/attendance',
      icon: FaClock,
    },
    {
      name: '経費申請',
      href: '/dashboard/expenses',
      icon: FaMoneyBill,
    },
    {
      name: 'その他手当',
      href: '/dashboard/allowances',
      icon: FaBriefcase,
    },
    {
      name: '有給申請',
      href: '/dashboard/paid-leave',
      icon: FaCalendarAlt,
    },
    {
      name: '給与明細',
      href: '/dashboard/payslip',
      icon: FaFileAlt,
    },
  ];

  // 管理者専用メニュー
  const adminNavigation = [
    {
      name: '社員管理',
      href: '/dashboard/admin/users',
      icon: FaUsers,
    },
    {
      name: '申請承認',
      href: '/dashboard/admin/approvals',
      icon: FaCheckCircle,
    },
    {
      name: '管理設定',
      href: '/dashboard/admin/settings',
      icon: FaCog,
    },
  ];

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('ログアウトエラー:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 lg:flex">
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
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(item.href)
                    ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <item.icon className="mr-3 text-lg" />
                {item.name}
              </Link>
            ))}

            {/* 管理者メニュー（管理者のみ表示） */}
            {user?.role === 'admin' && (
              <div className="pt-4 mt-4 border-t border-gray-200">
                <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  管理者メニュー
                </p>
                <div className="mt-2 space-y-1">
                  {adminNavigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isActive(item.href)
                          ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <item.icon className="mr-3 text-lg" />
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </nav>

          {/* ユーザー情報 */}
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
                onClick={handleLogout}
                className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="ログアウト"
              >
                <FaSignOutAlt className="text-sm" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="flex-1 lg:flex lg:flex-col">
        {/* ヘッダー */}
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
                {navigation.find((item) => isActive(item.href))?.name ||
                  adminNavigation.find((item) => isActive(item.href))?.name ||
                  'ダッシュボード'}
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              {/* 通知アイコン */}
              <button className="p-2 rounded-lg text-gray-500 hover:bg-gray-100">
                <FaBell className="text-lg" />
              </button>

              {/* ログアウトボタン */}
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors flex items-center"
              >
                <FaSignOutAlt className="mr-2" />
                ログアウト
              </button>
            </div>
          </div>
        </header>

        {/* メインコンテンツエリア */}
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
