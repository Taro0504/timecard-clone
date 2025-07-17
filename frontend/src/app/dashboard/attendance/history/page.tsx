'use client';

import { useState, useEffect } from 'react';
import { FaSpinner, FaDownload } from 'react-icons/fa';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient, AttendanceRecord } from '@/lib/api';

export default function AttendanceHistoryPage() {
  const { token } = useAuth();
  const [attendanceRecords, setAttendanceRecords] = useState<
    AttendanceRecord[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);

  // 勤怠履歴を取得
  useEffect(() => {
    const fetchAttendanceHistory = async () => {
      if (!token) return;

      try {
        setIsLoading(true);
        const history = await apiClient.getAttendanceHistory(
          token,
          selectedYear,
          selectedMonth
        );
        setAttendanceRecords(history);
      } catch (error) {
        console.error('勤怠履歴取得エラー:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAttendanceHistory();
  }, [token, selectedYear, selectedMonth]);

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

  const formatBreakTime = (minutes: number) => {
    if (minutes === 0) return '0分';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0
      ? `${hours}時間${mins > 0 ? mins + '分' : ''}`
      : `${mins}分`;
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedYear(Number(e.target.value));
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMonth(Number(e.target.value));
  };

  const handleExportCSV = () => {
    // CSVエクスポート機能（将来的に実装）
    alert('CSVエクスポート機能は準備中です');
  };

  // 年と月の選択肢を生成
  const years = Array.from(
    { length: 5 },
    (_, i) => new Date().getFullYear() - i
  );
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">勤怠履歴</h1>
        <p className="text-gray-600">過去の勤怠記録を一覧で確認できます。</p>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <div className="flex items-center gap-4">
            <select
              value={selectedYear}
              onChange={handleYearChange}
              className="border rounded-lg px-3 py-2"
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}年
                </option>
              ))}
            </select>
            <select
              value={selectedMonth}
              onChange={handleMonthChange}
              className="border rounded-lg px-3 py-2"
            >
              {months.map((month) => (
                <option key={month} value={month}>
                  {month}月
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={handleExportCSV}
            className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 flex items-center gap-2"
          >
            <FaDownload />
            CSVダウンロード
          </button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <FaSpinner className="animate-spin text-4xl text-blue-600" />
          </div>
        ) : (
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
                    休憩
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
                {attendanceRecords.length > 0 ? (
                  attendanceRecords.map((record) => (
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
                        {formatBreakTime(record.break_minutes)}
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
                      colSpan={6}
                      className="px-6 py-4 text-center text-sm text-gray-500"
                    >
                      指定された期間の勤怠履歴がありません
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
