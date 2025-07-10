'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function DashboardPage() {
  const [isWorking, setIsWorking] = useState(false);
  const [workStartTime, setWorkStartTime] = useState<Date | null>(null);

  const handleClockIn = () => {
    setIsWorking(true);
    setWorkStartTime(new Date());
  };

  const handleClockOut = () => {
    setIsWorking(false);
    setWorkStartTime(null);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ja-JP', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* ウェルカムメッセージ */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          おはようございます、田中さん！
        </h1>
        <p className="text-gray-600">
          今日も1日がんばりましょう。現在の時刻: {formatTime(new Date())}
        </p>
      </div>

      {/* 出退勤カード */}
      <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">勤怠管理</h2>

          {/* 現在の状態表示 */}
          <div className="mb-8">
            {isWorking ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-center">
                  <span className="text-green-500 text-2xl mr-3">⏰</span>
                  <div>
                    <p className="text-green-700 font-medium">勤務中</p>
                    <p className="text-green-600 text-sm">
                      開始時刻: {workStartTime && formatTime(workStartTime)}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-center">
                  <span className="text-gray-500 text-2xl mr-3">😴</span>
                  <div>
                    <p className="text-gray-700 font-medium">勤務外</p>
                    <p className="text-gray-600 text-sm">
                      出勤ボタンを押して勤務を開始してください
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 出退勤ボタン */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-md mx-auto">
            <button
              onClick={handleClockIn}
              disabled={isWorking}
              className={`py-6 px-8 rounded-xl font-bold text-lg transition-all duration-200 ${
                isWorking
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl'
              }`}
            >
              <span className="block text-2xl mb-2">🟢</span>
              出勤
            </button>

            <button
              onClick={handleClockOut}
              disabled={!isWorking}
              className={`py-6 px-8 rounded-xl font-bold text-lg transition-all duration-200 ${
                !isWorking
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-red-600 text-white hover:bg-red-700 shadow-lg hover:shadow-xl'
              }`}
            >
              <span className="block text-2xl mb-2">🔴</span>
              退勤
            </button>
          </div>
        </div>
      </div>

      {/* クイックアクセス */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Link
          href="/dashboard/expenses"
          className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
        >
          <div className="flex items-center">
            <span className="text-3xl mr-4">💰</span>
            <div>
              <h3 className="text-lg font-bold text-gray-900">経費申請</h3>
              <p className="text-sm text-gray-600">業務経費の申請</p>
            </div>
          </div>
        </Link>

        <Link
          href="/dashboard/allowances"
          className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
        >
          <div className="flex items-center">
            <span className="text-3xl mr-4">💼</span>
            <div>
              <h3 className="text-lg font-bold text-gray-900">その他手当</h3>
              <p className="text-sm text-gray-600">各種手当の申請</p>
            </div>
          </div>
        </Link>

        <Link
          href="/dashboard/paid-leave"
          className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
        >
          <div className="flex items-center">
            <span className="text-3xl mr-4">🌴</span>
            <div>
              <h3 className="text-lg font-bold text-gray-900">有給申請</h3>
              <p className="text-sm text-gray-600">有給休暇の申請</p>
            </div>
          </div>
        </Link>

        <Link
          href="/dashboard/attendance"
          className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
        >
          <div className="flex items-center">
            <span className="text-3xl mr-4">⏰</span>
            <div>
              <h3 className="text-lg font-bold text-gray-900">勤怠管理</h3>
              <p className="text-sm text-gray-600">勤怠記録の確認</p>
            </div>
          </div>
        </Link>

        <Link
          href="/dashboard/mypage"
          className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
        >
          <div className="flex items-center">
            <span className="text-3xl mr-4">👤</span>
            <div>
              <h3 className="text-lg font-bold text-gray-900">マイページ</h3>
              <p className="text-sm text-gray-600">個人情報の確認</p>
            </div>
          </div>
        </Link>

        <Link
          href="/dashboard/payslip"
          className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
        >
          <div className="flex items-center">
            <span className="text-3xl mr-4">📄</span>
            <div>
              <h3 className="text-lg font-bold text-gray-900">給与明細</h3>
              <p className="text-sm text-gray-600">給与明細の確認</p>
            </div>
          </div>
        </Link>
      </div>

      {/* 管理者向けセクション */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl shadow-lg p-6 mb-8">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
          <span className="mr-2">👑</span>
          管理者メニュー
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/dashboard/admin/users"
            className="bg-white rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center">
              <span className="text-2xl mr-3">👥</span>
              <div>
                <h4 className="font-semibold text-gray-900">社員管理</h4>
                <p className="text-sm text-gray-600">社員情報の管理</p>
              </div>
            </div>
          </Link>

          <Link
            href="/dashboard/admin/approvals"
            className="bg-white rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center">
              <span className="text-2xl mr-3">✅</span>
              <div>
                <h4 className="font-semibold text-gray-900">申請承認</h4>
                <p className="text-sm text-gray-600">各種申請の承認</p>
              </div>
            </div>
          </Link>

          <Link
            href="/dashboard/admin/settings"
            className="bg-white rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center">
              <span className="text-2xl mr-3">⚙️</span>
              <div>
                <h4 className="font-semibold text-gray-900">管理設定</h4>
                <p className="text-sm text-gray-600">システム設定</p>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* 最近のお知らせ */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">最新のお知らせ</h3>
        <div className="space-y-3">
          <div className="flex items-start p-3 bg-blue-50 rounded-lg">
            <span className="text-blue-500 mr-3 mt-0.5">📢</span>
            <div>
              <p className="text-sm font-medium text-blue-900">
                年末年始の勤務予定について
              </p>
              <p className="text-xs text-blue-700 mt-1">2024年12月20日</p>
            </div>
          </div>

          <div className="flex items-start p-3 bg-green-50 rounded-lg">
            <span className="text-green-500 mr-3 mt-0.5">✅</span>
            <div>
              <p className="text-sm font-medium text-green-900">
                経費申請の締切について
              </p>
              <p className="text-xs text-green-700 mt-1">2024年12月18日</p>
            </div>
          </div>

          <div className="flex items-start p-3 bg-yellow-50 rounded-lg">
            <span className="text-yellow-500 mr-3 mt-0.5">⚠️</span>
            <div>
              <p className="text-sm font-medium text-yellow-900">
                システムメンテナンスのお知らせ
              </p>
              <p className="text-xs text-yellow-700 mt-1">2024年12月15日</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
