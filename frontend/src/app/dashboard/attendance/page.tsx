'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  FaUserSlash,
  FaPlayCircle,
  FaStopCircle,
  FaClock,
  FaSpinner,
  FaUndo,
} from 'react-icons/fa';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient, AttendanceRecord } from '@/lib/api';

const BREAK_OPTIONS = [
  { label: '0分', value: 0 },
  { label: '15分', value: 15 },
  { label: '30分', value: 30 },
  { label: '45分', value: 45 },
  { label: '1時間', value: 60 },
  { label: '1時間15分', value: 75 },
  { label: '1時間30分', value: 90 },
  { label: '1時間45分', value: 105 },
  { label: '2時間', value: 120 },
];

export default function AttendancePage() {
  const { token } = useAuth();
  const [todayAttendance, setTodayAttendance] =
    useState<AttendanceRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [breakMinutes, setBreakMinutes] = useState(60);
  const [attendanceHistory, setAttendanceHistory] = useState<
    AttendanceRecord[]
  >([]);

  // 今日の勤怠データを取得
  useEffect(() => {
    const fetchTodayAttendance = async () => {
      if (!token) return;

      try {
        setIsLoading(true);
        const today = await apiClient.getTodayAttendance(token);
        setTodayAttendance(today);

        if (today) {
          setBreakMinutes(today.break_minutes);
        }
      } catch (error) {
        console.error('今日の勤怠データ取得エラー:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTodayAttendance();
  }, [token]);

  // 勤怠履歴を取得
  useEffect(() => {
    const fetchAttendanceHistory = async () => {
      if (!token) return;

      try {
        const history = await apiClient.getAttendanceHistory(token);
        setAttendanceHistory(history.slice(0, 5)); // 最新5件のみ表示
      } catch (error) {
        console.error('勤怠履歴取得エラー:', error);
      }
    };

    fetchAttendanceHistory();
  }, [token]);

  const getStatusBadge = (status: string) => {
    const statusMap = {
      present: { bg: 'bg-green-100', text: 'text-green-800', label: '正常' },
      late: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: '遅刻' },
      early_leave: { bg: 'bg-blue-100', text: 'text-blue-800', label: '早退' },
      absent: { bg: 'bg-red-100', text: 'text-red-800', label: '欠勤' },
      half_day: { bg: 'bg-orange-100', text: 'text-orange-800', label: '半休' },
    };
    const config = statusMap[status as keyof typeof statusMap];
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}
      >
        {config.label}
      </span>
    );
  };

  const handleClockIn = async () => {
    if (!token) return;

    try {
      setIsSubmitting(true);
      const newAttendance = await apiClient.clockIn(token, {
        break_minutes: breakMinutes,
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
        break_minutes: breakMinutes,
      });
      setTodayAttendance(updatedAttendance);

      // 履歴を更新
      const history = await apiClient.getAttendanceHistory(token);
      setAttendanceHistory(history.slice(0, 5));
    } catch (error) {
      console.error('退勤エラー:', error);
      alert('退勤の記録に失敗しました。');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelClockOut = async () => {
    if (!token || !todayAttendance) return;

    try {
      setIsSubmitting(true);
      const updatedAttendance = await apiClient.cancelClockOut(token);
      setTodayAttendance(updatedAttendance);

      // 履歴を更新
      const history = await apiClient.getAttendanceHistory(token);
      setAttendanceHistory(history.slice(0, 5));
    } catch (error) {
      console.error('退勤キャンセルエラー:', error);
      alert('退勤キャンセルに失敗しました。');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBreakChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setBreakMinutes(Number(e.target.value));
  };

  const formatTime = (timeString: string | null | undefined) => {
    if (!timeString) return '--:--';
    const date = new Date(timeString);
    return date.toLocaleTimeString('ja-JP', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  // 実働時間計算
  const getWorkDuration = (attendance: AttendanceRecord) => {
    if (!attendance.clock_out) return '--:--';

    const startTime = new Date(attendance.clock_in!);
    const endTime = new Date(attendance.clock_out);
    const ms =
      endTime.getTime() -
      startTime.getTime() -
      attendance.break_minutes * 60 * 1000;

    if (ms <= 0) return '0:00';
    const h = Math.floor(ms / (1000 * 60 * 60));
    const m = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    return `${h}:${m.toString().padStart(2, '0')}`;
  };

  const isWorking = todayAttendance && !todayAttendance.clock_out;

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <FaSpinner className="animate-spin text-4xl text-blue-600" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">勤怠管理</h1>
        <p className="text-gray-600">本日の出勤・退勤・休憩を記録します。</p>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-6">出退勤操作</h2>
          <div className="mb-8">
            {isWorking ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-center">
                  <FaClock className="text-green-500 text-2xl mr-3" />
                  <div>
                    <p className="text-green-700 font-medium">勤務中</p>
                    <p className="text-green-600 text-sm">
                      開始時刻: {formatTime(todayAttendance?.clock_in)}
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
                      {todayAttendance
                        ? '本日は既に退勤済みです'
                        : '出勤ボタンを押して勤務を開始してください'}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

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
            {isWorking ? (
              <button
                onClick={handleClockOut}
                disabled={isSubmitting}
                className={`py-6 px-8 rounded-xl font-bold text-lg transition-all duration-200 ${
                  isSubmitting
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
            ) : todayAttendance?.clock_out ? (
              <button
                onClick={handleCancelClockOut}
                disabled={isSubmitting}
                className={`py-6 px-8 rounded-xl font-bold text-lg transition-all duration-200 ${
                  isSubmitting
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-orange-600 text-white hover:bg-orange-700 shadow-lg hover:shadow-xl'
                }`}
              >
                {isSubmitting ? (
                  <FaSpinner className="block text-2xl mb-2 animate-spin" />
                ) : (
                  <FaUndo className="block text-2xl mb-2" />
                )}
                退勤キャンセル
              </button>
            ) : (
              <button
                disabled
                className="py-6 px-8 rounded-xl font-bold text-lg bg-gray-300 text-gray-500 cursor-not-allowed"
              >
                <FaStopCircle className="block text-2xl mb-2" />
                退勤
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 休憩時間設定 */}
      <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
        <h3 className="text-lg font-bold text-gray-900 mb-4">休憩時間の設定</h3>
        <div className="flex items-center space-x-4">
          <label htmlFor="break" className="text-gray-700 font-medium">
            休憩時間
          </label>
          <select
            id="break"
            value={breakMinutes}
            onChange={handleBreakChange}
            className="px-4 py-2 border rounded-lg"
            disabled={!isWorking && !todayAttendance?.clock_out}
          >
            {BREAK_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        <p className="text-sm text-gray-500 mt-2">※ 15分単位で選択できます</p>
      </div>

      {/* 勤怠サマリー */}
      {todayAttendance && (
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            本日のサマリー
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-gray-500 text-sm mb-1">出勤時刻</p>
              <p className="text-xl font-bold text-gray-900">
                {formatTime(todayAttendance.clock_in)}
              </p>
            </div>
            <div>
              <p className="text-gray-500 text-sm mb-1">退勤時刻</p>
              <p className="text-xl font-bold text-gray-900">
                {formatTime(todayAttendance.clock_out)}
              </p>
            </div>
            <div>
              <p className="text-gray-500 text-sm mb-1">実働時間</p>
              <p className="text-xl font-bold text-gray-900">
                {getWorkDuration(todayAttendance)}
              </p>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-gray-500 text-sm mb-1">休憩時間</p>
            <p className="text-lg font-bold text-gray-900">
              {todayAttendance.break_minutes > 0
                ? `${Math.floor(todayAttendance.break_minutes / 60)}時間${todayAttendance.break_minutes % 60 ? (todayAttendance.break_minutes % 60) + '分' : ''}`
                : '0分'}
            </p>
          </div>
          <div className="mt-4">
            <p className="text-gray-500 text-sm mb-1">ステータス</p>
            <div>{getStatusBadge(todayAttendance.status)}</div>
          </div>
        </div>
      )}

      {/* 勤怠履歴 */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-900">最近の勤怠履歴</h3>
          <Link
            href="/dashboard/attendance/history"
            className="text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            すべての履歴を見る →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  日付
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  出勤
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  退勤
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  実働
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ステータス
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {attendanceHistory.length > 0 ? (
                attendanceHistory.map((record) => (
                  <tr key={record.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(record.date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatTime(record.clock_in)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatTime(record.clock_out)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {getWorkDuration(record)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(record.status)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-4 text-center text-sm text-gray-500"
                  >
                    勤怠履歴がありません
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
