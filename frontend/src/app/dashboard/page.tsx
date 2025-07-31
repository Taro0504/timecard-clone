import { Suspense } from 'react';
import { DashboardPageClient } from './DashboardPageClient';
import { LoadingSpinner } from '@/components/dashboard/LoadingSpinner';

// Server Componentとしてデータフェッチを行う
async function getDashboardData() {
  // サーバーサイドでのデータフェッチ
  // 実際の実装では、APIからデータを取得
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

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <DashboardPageClient dashboardData={dashboardData} />
    </Suspense>
  );
}
