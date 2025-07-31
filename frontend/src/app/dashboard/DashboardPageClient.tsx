'use client';

import { memo } from 'react';
import Link from 'next/link';
import {
  FaCheckCircle,
  FaCog,
  FaExclamationTriangle,
  FaCrown,
  FaBullhorn,
  FaUserSlash,
  FaPlayCircle,
  FaStopCircle,
  FaMoneyBill,
  FaBriefcase,
  FaCalendarAlt,
  FaClock,
  FaUser,
  FaFileAlt,
  FaSpinner,
} from 'react-icons/fa';
import { useAuth } from '@/contexts/AuthContext';
import { useAttendance } from '@/hooks/useAttendance';
import { formatTime, formatTimeFromString } from '@/lib/utils/time';
import { AttendanceRecord } from '@/lib/api';

interface DashboardData {
  quickAccessItems: {
    title: string;
    description: string;
    href: string;
    icon: string;
  }[];
  adminMenuItems: {
    title: string;
    description: string;
    href: string;
    icon: string;
  }[];
  newsItems: {
    id: string;
    title: string;
    date: string;
    type: 'info' | 'success' | 'warning';
    icon: string;
  }[];
}

interface DashboardPageClientProps {
  dashboardData: DashboardData;
}

// アイコンマッピング
const iconMap = {
  FaMoneyBill,
  FaBriefcase,
  FaCalendarAlt,
  FaClock,
  FaUser,
  FaFileAlt,
  FaCheckCircle,
  FaCog,
  FaExclamationTriangle,
  FaBullhorn,
  FaCrown,
};

// ウェルカムメッセージコンポーネント
const WelcomeMessage = memo(({ userName }: { userName: string }) => (
  <div className="mb-8">
    <h1 className="text-3xl font-bold text-gray-900 mb-2">
      おはようございます、{userName}さん！
    </h1>
    <p className="text-gray-600">
      今日も1日がんばりましょう。現在の時刻: {formatTime(new Date())}
    </p>
  </div>
));

WelcomeMessage.displayName = 'WelcomeMessage';

// 勤怠状態コンポーネント
const AttendanceStatus = memo(
  ({
    isLoading,
    todayAttendance,
    isWorking,
  }: {
    isLoading: boolean;
    todayAttendance: AttendanceRecord | null;
    isWorking: boolean;
  }) => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-20">
          <FaSpinner className="animate-spin text-2xl text-blue-600" />
        </div>
      );
    }

    if (isWorking) {
      return (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-center">
            <FaClock className="text-green-500 text-2xl mr-3" />
            <div>
              <p className="text-green-700 font-medium">勤務中</p>
              <p className="text-green-600 text-sm">
                開始時刻: {formatTimeFromString(todayAttendance?.clock_in)}
              </p>
            </div>
          </div>
        </div>
      );
    }

    if (todayAttendance) {
      return (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-center">
            <FaUserSlash className="text-gray-500 text-2xl mr-3" />
            <div>
              <p className="text-gray-700 font-medium">本日は退勤済み</p>
              <p className="text-gray-600 text-sm">
                出勤: {formatTimeFromString(todayAttendance.clock_in)} / 退勤:{' '}
                {formatTimeFromString(todayAttendance.clock_out)}
              </p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-center">
          <FaUserSlash className="text-gray-500 text-2xl mr-3" />
          <div>
            <p className="text-gray-700 font-medium">勤務外</p>
            <p className="text-gray-600 text-sm">
              出勤ボタンを押して勤務を開始してください
            </p>
          </div>
        </div>
      </div>
    );
  }
);

AttendanceStatus.displayName = 'AttendanceStatus';

// 勤怠ボタンコンポーネント
const AttendanceButtons = memo(
  ({
    isWorking,
    isSubmitting,
    todayAttendance,
    onClockIn,
    onClockOut,
  }: {
    isWorking: boolean;
    isSubmitting: boolean;
    todayAttendance: AttendanceRecord | null;
    onClockIn: () => void;
    onClockOut: () => void;
  }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-md mx-auto">
      <button
        onClick={onClockIn}
        disabled={isWorking || isSubmitting || !!todayAttendance}
        className={`py-6 px-8 rounded-xl font-bold text-lg transition-all duration-200 ${
          isWorking || isSubmitting || !!todayAttendance
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl'
        }`}
      >
        {isSubmitting ? (
          <FaSpinner className="block text-2xl mb-2 animate-spin" />
        ) : (
          <FaPlayCircle className="block text-2xl mb-2" />
        )}
        出勤
      </button>

      <button
        onClick={onClockOut}
        disabled={!isWorking || isSubmitting}
        className={`py-6 px-8 rounded-xl font-bold text-lg transition-all duration-200 ${
          !isWorking || isSubmitting
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-red-600 text-white hover:bg-red-700 shadow-lg hover:shadow-xl'
        }`}
      >
        {isSubmitting ? (
          <FaSpinner className="block text-2xl mb-2 animate-spin" />
        ) : (
          <FaStopCircle className="block text-2xl mb-2" />
        )}
        退勤
      </button>
    </div>
  )
);

AttendanceButtons.displayName = 'AttendanceButtons';

// クイックアクセスカードコンポーネント
const QuickAccessCard = memo(
  ({
    title,
    description,
    href,
    icon,
  }: {
    title: string;
    description: string;
    href: string;
    icon: string;
  }) => {
    const IconComponent = iconMap[icon as keyof typeof iconMap];

    return (
      <Link
        href={href as any}
        className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
      >
        <div className="flex items-center">
          <IconComponent className="text-3xl mr-4" />
          <div>
            <h3 className="text-lg font-bold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-600">{description}</p>
          </div>
        </div>
      </Link>
    );
  }
);

QuickAccessCard.displayName = 'QuickAccessCard';

// 管理者メニューカードコンポーネント
const AdminMenuCard = memo(
  ({
    title,
    description,
    href,
    icon,
  }: {
    title: string;
    description: string;
    href: string;
    icon: string;
  }) => {
    const IconComponent = iconMap[icon as keyof typeof iconMap];

    return (
      <Link
        href={href as any}
        className="bg-white rounded-lg p-4 hover:shadow-md transition-shadow"
      >
        <div className="flex items-center">
          <IconComponent className="text-2xl mr-3 text-green-500" />
          <div>
            <h4 className="font-semibold text-gray-900">{title}</h4>
            <p className="text-sm text-gray-600">{description}</p>
          </div>
        </div>
      </Link>
    );
  }
);

AdminMenuCard.displayName = 'AdminMenuCard';

// お知らせアイテムコンポーネント
const NewsItemComponent = memo(
  ({
    title,
    date,
    type,
    icon,
  }: {
    title: string;
    date: string;
    type: 'info' | 'success' | 'warning';
    icon: string;
  }) => {
    const IconComponent = iconMap[icon as keyof typeof iconMap];

    const bgColorClass = {
      info: 'bg-blue-50',
      success: 'bg-green-50',
      warning: 'bg-yellow-50',
    }[type];

    const textColorClass = {
      info: 'text-blue-500',
      success: 'text-green-500',
      warning: 'text-yellow-500',
    }[type];

    const titleColorClass = {
      info: 'text-blue-900',
      success: 'text-green-900',
      warning: 'text-yellow-900',
    }[type];

    const dateColorClass = {
      info: 'text-blue-700',
      success: 'text-green-700',
      warning: 'text-yellow-700',
    }[type];

    return (
      <div className={`flex items-start p-3 ${bgColorClass} rounded-lg`}>
        <IconComponent className={`${textColorClass} mr-3 mt-0.5 text-lg`} />
        <div>
          <p className={`text-sm font-medium ${titleColorClass}`}>{title}</p>
          <p className={`text-xs ${dateColorClass} mt-1`}>{date}</p>
        </div>
      </div>
    );
  }
);

NewsItemComponent.displayName = 'NewsItem';

export function DashboardPageClient({
  dashboardData,
}: DashboardPageClientProps) {
  const { user } = useAuth();
  const {
    todayAttendance,
    isLoading,
    isSubmitting,
    handleClockIn,
    handleClockOut,
  } = useAttendance();

  const isWorking = Boolean(todayAttendance && !todayAttendance.clock_out);

  return (
    <div className="max-w-6xl mx-auto">
      {/* ウェルカムメッセージ */}
      <WelcomeMessage userName={user?.first_name || 'ユーザー'} />

      {/* 出退勤カード */}
      <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">勤怠管理</h2>

          {/* 現在の状態表示 */}
          <AttendanceStatus
            isLoading={isLoading}
            todayAttendance={todayAttendance}
            isWorking={isWorking}
          />

          {/* 出退勤ボタン */}
          <AttendanceButtons
            isWorking={isWorking}
            isSubmitting={isSubmitting}
            todayAttendance={todayAttendance}
            onClockIn={handleClockIn}
            onClockOut={handleClockOut}
          />
        </div>
      </div>

      {/* クイックアクセス */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {dashboardData.quickAccessItems.map((item) => (
          <QuickAccessCard key={item.title} {...item} />
        ))}
      </div>

      {/* 管理者向けセクション */}
      {user?.role === 'admin' && (
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl shadow-lg p-6 mb-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
            <FaCrown className="mr-2" />
            管理者メニュー
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {dashboardData.adminMenuItems.map((item) => (
              <AdminMenuCard key={item.title} {...item} />
            ))}
          </div>
        </div>
      )}

      {/* 最近のお知らせ */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">最新のお知らせ</h3>
        <div className="space-y-3">
          {dashboardData.newsItems.map((item) => (
            <NewsItemComponent key={item.id} {...item} />
          ))}
        </div>
      </div>
    </div>
  );
}
