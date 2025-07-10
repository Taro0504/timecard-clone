'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  FaUserSlash,
  FaPlayCircle,
  FaStopCircle,
  FaClock,
} from 'react-icons/fa';

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

interface AttendanceRecord {
  date: string;
  clockIn: string;
  clockOut: string;
  breakTime: string;
  workingHours: string;
  status: 'normal' | 'late' | 'early' | 'absent';
}

export default function AttendancePage() {
  const [isWorking, setIsWorking] = useState(false);
  const [workStartTime, setWorkStartTime] = useState<Date | null>(null);
  const [workEndTime, setWorkEndTime] = useState<Date | null>(null);
  const [breakMinutes, setBreakMinutes] = useState(60);

  // ダミーデータ (勤怠履歴)
  const attendanceRecords: AttendanceRecord[] = [
    {
      date: '2024-12-20',
      clockIn: '09:00',
      clockOut: '18:00',
      breakTime: '1:00',
      workingHours: '8:00',
      status: 'normal',
    },
    {
      date: '2024-12-19',
      clockIn: '09:15',
      clockOut: '18:15',
      breakTime: '1:00',
      workingHours: '8:00',
      status: 'late',
    },
    {
      date: '2024-12-18',
      clockIn: '09:00',
      clockOut: '17:30',
      breakTime: '1:00',
      workingHours: '7:30',
      status: 'early',
    },
  ];

  const getStatusBadge = (status: string) => {
    const statusMap = {
      normal: { bg: 'bg-green-100', text: 'text-green-800', label: '正常' },
      late: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: '遅刻' },
      early: { bg: 'bg-blue-100', text: 'text-blue-800', label: '早退' },
      absent: { bg: 'bg-red-100', text: 'text-red-800', label: '欠勤' },
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

  const handleClockIn = () => {
    setIsWorking(true);
    setWorkStartTime(new Date());
    setWorkEndTime(null);
  };

  const handleClockOut = () => {
    setIsWorking(false);
    setWorkEndTime(new Date());
  };

  const handleBreakChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setBreakMinutes(Number(e.target.value));
  };

  const formatTime = (date: Date | null) =>
    date
      ? date.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })
      : '--:--';

  // 実働時間計算
  const getWorkDuration = () => {
    if (!workStartTime || !workEndTime) return '--:--';
    const ms =
      workEndTime.getTime() -
      workStartTime.getTime() -
      breakMinutes * 60 * 1000;
    if (ms <= 0) return '0:00';
    const h = Math.floor(ms / (1000 * 60 * 60));
    const m = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    return `${h}:${m.toString().padStart(2, '0')}`;
  };

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
                      開始時刻: {formatTime(workStartTime)}
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
              <FaPlayCircle className="block text-2xl mb-2" />
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
              <FaStopCircle className="block text-2xl mb-2" />
              退勤
            </button>
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
            disabled={!isWorking && !workEndTime}
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
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h3 className="text-lg font-bold text-gray-900 mb-4">本日のサマリー</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-gray-500 text-sm mb-1">出勤時刻</p>
            <p className="text-xl font-bold text-gray-900">
              {formatTime(workStartTime)}
            </p>
          </div>
          <div>
            <p className="text-gray-500 text-sm mb-1">退勤時刻</p>
            <p className="text-xl font-bold text-gray-900">
              {formatTime(workEndTime)}
            </p>
          </div>
          <div>
            <p className="text-gray-500 text-sm mb-1">実働時間</p>
            <p className="text-xl font-bold text-gray-900">
              {getWorkDuration()}
            </p>
          </div>
        </div>
        <div className="mt-4">
          <p className="text-gray-500 text-sm mb-1">休憩時間</p>
          <p className="text-lg font-bold text-gray-900">
            {breakMinutes > 0
              ? `${Math.floor(breakMinutes / 60)}時間${breakMinutes % 60 ? (breakMinutes % 60) + '分' : ''}`
              : '0分'}
          </p>
        </div>
      </div>

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
              {attendanceRecords.map((record) => (
                <tr key={record.date}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {record.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {record.clockIn}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {record.clockOut}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {record.workingHours}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(record.status)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
