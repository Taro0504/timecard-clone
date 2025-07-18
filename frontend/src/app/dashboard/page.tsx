'use client';

import { useState, useEffect } from 'react';
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
import { apiClient, AttendanceRecord } from '@/lib/api';

export default function DashboardPage() {
  const { user, token } = useAuth();
  const [todayAttendance, setTodayAttendance] =
    useState<AttendanceRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 今日の勤怠データを取得
  useEffect(() => {
    const fetchTodayAttendance = async () => {
      if (!token) return;

      try {
        setIsLoading(true);
        const today = await apiClient.getTodayAttendance(token);
        setTodayAttendance(today);
      } catch (error) {
        console.error('今日の勤怠データ取得エラー:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTodayAttendance();
  }, [token]);

  const handleClockIn = async () => {
    if (!token) return;

    try {
      setIsSubmitting(true);
      const newAttendance = await apiClient.clockIn(token, {
        break_minutes: 60, // デフォルト1時間
      });
      setTodayAttendance(newAttendance);
    } catch (error) {
      console.error('出勤エラー:', error);
      alert('出勤の記録に失敗しました。');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClockOut = async () => {
    if (!token || !todayAttendance) return;

    try {
      setIsSubmitting(true);
      const updatedAttendance = await apiClient.clockOut(token, {
        clock_out: new Date().toISOString(),
        break_minutes: todayAttendance.break_minutes,
      });
      setTodayAttendance(updatedAttendance);
    } catch (error) {
      console.error('退勤エラー:', error);
      alert('退勤の記録に失敗しました。');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ja-JP', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatTimeFromString = (timeString: string | null | undefined) => {
    if (!timeString) return '--:--';
    const date = new Date(timeString);
    return date.toLocaleTimeString('ja-JP', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const isWorking = todayAttendance && !todayAttendance.clock_out;

  return (
    <div className="max-w-6xl mx-auto">
      {/* ウェルカムメッセージ */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          おはようございます、{user?.first_name || 'ユーザー'}さん！
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
            {isLoading ? (
              <div className="flex items-center justify-center h-20">
                <FaSpinner className="animate-spin text-2xl text-blue-600" />
              </div>
            ) : isWorking ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-center">
                  <FaClock className="text-green-500 text-2xl mr-3" />
                  <div>
                    <p className="text-green-700 font-medium">勤務中</p>
                    <p className="text-green-600 text-sm">
                      開始時刻:{' '}
                      {formatTimeFromString(todayAttendance?.clock_in)}
                    </p>
                  </div>
                </div>
              </div>
            ) : todayAttendance ? (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-center">
                  <FaUserSlash className="text-gray-500 text-2xl mr-3" />
                  <div>
                    <p className="text-gray-700 font-medium">本日は退勤済み</p>
                    <p className="text-gray-600 text-sm">
                      出勤: {formatTimeFromString(todayAttendance.clock_in)} /
                      退勤: {formatTimeFromString(todayAttendance.clock_out)}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
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
            )}
          </div>

          {/* 出退勤ボタン */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-md mx-auto">
            <button
              onClick={handleClockIn}
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
              onClick={handleClockOut}
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
        </div>
      </div>

      {/* クイックアクセス */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Link
          href="/dashboard/expenses"
          className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
        >
          <div className="flex items-center">
            <FaMoneyBill className="text-3xl mr-4" />
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
            <FaBriefcase className="text-3xl mr-4" />
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
            <FaCalendarAlt className="text-3xl mr-4" />
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
            <FaClock className="text-3xl mr-4" />
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
            <FaUser className="text-3xl mr-4" />
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
            <FaFileAlt className="text-3xl mr-4" />
            <div>
              <h3 className="text-lg font-bold text-gray-900">給与明細</h3>
              <p className="text-sm text-gray-600">給与明細の確認</p>
            </div>
          </div>
        </Link>
      </div>

      {/* 管理者向けセクション */}
      {user?.role === 'admin' && (
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl shadow-lg p-6 mb-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
            <FaCrown className="mr-2" />
            管理者メニュー
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/dashboard/admin/users"
              className="bg-white rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center">
                <FaCheckCircle className="text-2xl mr-3 text-green-500" />
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
                <FaCheckCircle className="text-2xl mr-3 text-green-500" />
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
                <FaCog className="text-2xl mr-3 text-blue-500" />
                <div>
                  <h4 className="font-semibold text-gray-900">管理設定</h4>
                  <p className="text-sm text-gray-600">システム設定</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      )}

      {/* 最近のお知らせ */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">最新のお知らせ</h3>
        <div className="space-y-3">
          <div className="flex items-start p-3 bg-blue-50 rounded-lg">
            <FaBullhorn className="text-blue-500 mr-3 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-900">
                年末年始の勤務予定について
              </p>
              <p className="text-xs text-blue-700 mt-1">2024年12月20日</p>
            </div>
          </div>

          <div className="flex items-start p-3 bg-green-50 rounded-lg">
            <FaCheckCircle className="text-green-500 mr-3 mt-0.5 text-lg" />
            <div>
              <p className="text-sm font-medium text-green-900">
                経費申請の締切について
              </p>
              <p className="text-xs text-green-700 mt-1">2024年12月18日</p>
            </div>
          </div>

          <div className="flex items-start p-3 bg-yellow-50 rounded-lg">
            <FaExclamationTriangle className="text-yellow-500 mr-3 mt-0.5 text-lg" />
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
