import { redirect } from 'next/navigation';
import type { Route } from 'next';
import Link from 'next/link';
import { getAuthData } from '@/lib/auth/getAuthData';
import { WelcomeMessageClient } from '@/components/dashboard/WelcomeMessageClient';
import { AttendancePanelClient } from '@/components/dashboard/AttendancePanelClient';
import { QuickAccessCard } from '@/components/dashboard/QuickAccessCard';
import { AdminMenuCard } from '@/components/dashboard/AdminMenuCard';
import { NewsItem } from '@/components/dashboard/NewsItem';

type DashboardData = {
  quickAccessItems: {
    title: string;
    description: string;
    href: Route;
    icon: string;
  }[];
  adminMenuItems: {
    title: string;
    description: string;
    href: Route;
    icon: string;
  }[];
  newsItems: {
    id: string;
    title: string;
    date: string;
    type: 'info' | 'success' | 'warning';
    icon: string;
  }[];
};

async function getDashboardData(): Promise<DashboardData> {
  return {
    quickAccessItems: [
      {
        title: '経費申請',
        description: '業務経費の申請',
        href: '/dashboard/expenses',
        icon: 'FaMoneyBill',
      },
      {
        title: 'その他手当',
        description: '各種手当の申請',
        href: '/dashboard/allowances',
        icon: 'FaBriefcase',
      },
      {
        title: '有給申請',
        description: '有給休暇の申請',
        href: '/dashboard/paid-leave',
        icon: 'FaCalendarAlt',
      },
      {
        title: '勤怠管理',
        description: '勤怠記録の確認',
        href: '/dashboard/attendance',
        icon: 'FaClock',
      },
      {
        title: 'マイページ',
        description: '個人情報の確認',
        href: '/dashboard/mypage',
        icon: 'FaUser',
      },
      {
        title: '給与明細',
        description: '給与明細の確認',
        href: '/dashboard/payslip',
        icon: 'FaFileAlt',
      },
    ],
    adminMenuItems: [
      {
        title: '社員管理',
        description: '社員情報の管理',
        href: '/dashboard/admin/users',
        icon: 'FaCheckCircle',
      },
      {
        title: '申請承認',
        description: '各種申請の承認',
        href: '/dashboard/admin/approvals',
        icon: 'FaCheckCircle',
      },
      {
        title: '管理設定',
        description: 'システム設定',
        href: '/dashboard/admin/settings',
        icon: 'FaCog',
      },
    ],
    newsItems: [
      {
        id: '1',
        title: '年末年始の勤務予定について',
        date: '2024年12月20日',
        type: 'info',
        icon: 'FaBullhorn',
      },
      {
        id: '2',
        title: '経費申請の締切について',
        date: '2024年12月18日',
        type: 'success',
        icon: 'FaCheckCircle',
      },
      {
        id: '3',
        title: 'システムメンテナンスのお知らせ',
        date: '2024年12月15日',
        type: 'warning',
        icon: 'FaExclamationTriangle',
      },
    ],
  };
}

export default async function DashboardPage() {
  const dashboardData = await getDashboardData();
  const authData = await getAuthData();
  if (!authData.isAuthenticated) redirect('/login');

  return (
    <div className="max-w-6xl mx-auto">
      {/* 挨拶＆現在時刻（クライアント小島） */}
      <WelcomeMessageClient userName={authData.user?.full_name ?? 'ユーザー'} />

      {/* 出退勤（クライアント小島） */}
      <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">勤怠管理</h2>
          <AttendancePanelClient />
        </div>
      </div>

      {/* クイックアクセス（ServerでSSR） */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {dashboardData.quickAccessItems.map((item) => (
          <QuickAccessCard key={item.title} {...item} />
        ))}
      </div>

      {/* 管理者向け（ServerでSSR、表示可否はroleで分岐） */}
      {authData.user?.role === 'admin' && (
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl shadow-lg p-6 mb-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
            {/* 見出しアイコンは必要ならServer側で直接設置 */}
            <span className="mr-2">👑</span>
            管理者メニュー
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {dashboardData.adminMenuItems.map((item) => (
              <AdminMenuCard key={item.title} {...item} />
            ))}
          </div>
        </div>
      )}

      {/* 最近のお知らせ（ServerでSSR） */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">最新のお知らせ</h3>
        <div className="space-y-3">
          {dashboardData.newsItems.map((item) => (
            <NewsItem key={item.id} {...item} />
          ))}
          {dashboardData.newsItems.length === 0 && (
            <p className="text-sm text-gray-500">
              現在お知らせはありません。
              <Link href="/dashboard" className="underline">
                一覧を見る
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
