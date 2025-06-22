'use client';

interface AttendanceRecord {
  date: string;
  clockIn: string;
  clockOut: string;
  breakTime: string;
  workingHours: string;
  status: 'normal' | 'late' | 'early' | 'absent';
  notes?: string;
}

const allAttendanceRecords: AttendanceRecord[] = [
  // ... (20件ほどのダミーデータ)
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
  {
    date: '2024-12-17',
    clockIn: '09:00',
    clockOut: '18:00',
    breakTime: '1:00',
    workingHours: '8:00',
    status: 'normal',
  },
  {
    date: '2024-12-16',
    clockIn: '09:00',
    clockOut: '18:00',
    breakTime: '1:00',
    workingHours: '8:00',
    status: 'normal',
  },
  {
    date: '2024-12-13',
    clockIn: '09:00',
    clockOut: '18:00',
    breakTime: '1:00',
    workingHours: '8:00',
    status: 'normal',
  },
  {
    date: '2024-12-12',
    clockIn: '09:00',
    clockOut: '18:00',
    breakTime: '1:00',
    workingHours: '8:00',
    status: 'normal',
  },
  {
    date: '2024-12-11',
    clockIn: '09:05',
    clockOut: '18:00',
    breakTime: '1:00',
    workingHours: '7:55',
    status: 'late',
  },
  {
    date: '2024-12-10',
    clockIn: '09:00',
    clockOut: '18:00',
    breakTime: '1:00',
    workingHours: '8:00',
    status: 'normal',
  },
  {
    date: '2024-12-09',
    clockIn: '09:00',
    clockOut: '18:00',
    breakTime: '1:00',
    workingHours: '8:00',
    status: 'normal',
  },
  {
    date: '2024-12-06',
    clockIn: '09:00',
    clockOut: '18:00',
    breakTime: '1:00',
    workingHours: '8:00',
    status: 'normal',
  },
  {
    date: '2024-12-05',
    clockIn: '09:00',
    clockOut: '18:00',
    breakTime: '1:00',
    workingHours: '8:00',
    status: 'normal',
  },
  {
    date: '2024-12-04',
    clockIn: '09:00',
    clockOut: '18:00',
    breakTime: '1:00',
    workingHours: '8:00',
    status: 'normal',
  },
  {
    date: '2024-12-03',
    clockIn: '09:00',
    clockOut: '18:00',
    breakTime: '1:00',
    workingHours: '8:00',
    status: 'normal',
  },
  {
    date: '2024-12-02',
    clockIn: '09:00',
    clockOut: '18:00',
    breakTime: '1:00',
    workingHours: '8:00',
    status: 'normal',
  },
];

export default function AttendanceHistoryPage() {
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

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">勤怠履歴</h1>
        <p className="text-gray-600">過去の勤怠記録を一覧で確認できます。</p>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <div className="flex items-center gap-4">
            <select className="border rounded-lg px-3 py-2">
              <option>2024年</option>
              <option>2023年</option>
            </select>
            <select className="border rounded-lg px-3 py-2">
              <option>12月</option>
              <option>11月</option>
              <option>10月</option>
            </select>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              表示
            </button>
          </div>
          <button className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800">
            CSVダウンロード
          </button>
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
              {allAttendanceRecords.map((record) => (
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
                    {record.breakTime}
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
