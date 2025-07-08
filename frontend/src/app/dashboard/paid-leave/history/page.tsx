'use client';

import Link from 'next/link';

// 型定義
interface PaidLeaveHistory {
  id: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  applicationDate: string;
  status: 'pending' | 'approved' | 'rejected';
}

export default function PaidLeaveHistoryPage() {
  // ダミーデータ
  const paidLeaveHistory: PaidLeaveHistory[] = [
    {
      id: '1',
      leaveType: '有給休暇',
      startDate: '2024-12-25',
      endDate: '2024-12-27',
      days: 3,
      reason: '年末年始の家族旅行のため',
      applicationDate: '2024-12-18',
      status: 'approved',
    },
    {
      id: '2',
      leaveType: '特別休暇',
      startDate: '2024-12-30',
      endDate: '2024-12-30',
      days: 1,
      reason: '病院での定期検診のため',
      applicationDate: '2024-12-20',
      status: 'pending',
    },
    {
      id: '3',
      leaveType: '夏季休暇',
      startDate: '2024-08-12',
      endDate: '2024-08-16',
      days: 5,
      reason: '夏季休暇として家族と旅行',
      applicationDate: '2024-08-01',
      status: 'approved',
    },
  ];

  const getStatusBadge = (status: string) => {
    const statusMap = {
      pending: {
        bg: 'bg-yellow-100',
        text: 'text-yellow-800',
        label: '承認待ち',
      },
      approved: {
        bg: 'bg-green-100',
        text: 'text-green-800',
        label: '承認済み',
      },
      rejected: { bg: 'bg-red-100', text: 'text-red-800', label: '却下' },
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            有給申請履歴
          </h1>
          <p className="text-gray-600">過去の有給申請の履歴を確認できます。</p>
        </div>
        <Link
          href="/dashboard/paid-leave"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          新規申請
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-lg">
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    申請日
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    有給種別
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    期間
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    日数
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    理由
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ステータス
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paidLeaveHistory.map((leave) => (
                  <tr key={leave.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(leave.applicationDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {leave.leaveType}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(leave.startDate)} 〜{' '}
                      {formatDate(leave.endDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {leave.days}日
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                      {leave.reason}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(leave.status)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {paidLeaveHistory.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">🌴</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                申請履歴がありません
              </h3>
              <p className="text-gray-600 mb-6">
                まだ有給申請を行っていません。
              </p>
              <Link
                href="/dashboard/paid-leave"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                初回申請を行う
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* 有給残日数情報 */}
      <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">有給残日数</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center">
              <span className="text-blue-500 text-2xl mr-3">📅</span>
              <div>
                <p className="text-sm font-medium text-blue-700">付与日数</p>
                <p className="text-2xl font-bold text-blue-900">20日</p>
              </div>
            </div>
          </div>

          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center">
              <span className="text-green-500 text-2xl mr-3">✅</span>
              <div>
                <p className="text-sm font-medium text-green-700">使用済み</p>
                <p className="text-2xl font-bold text-green-900">8日</p>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 rounded-lg p-4">
            <div className="flex items-center">
              <span className="text-yellow-500 text-2xl mr-3">⏳</span>
              <div>
                <p className="text-sm font-medium text-yellow-700">残日数</p>
                <p className="text-2xl font-bold text-yellow-900">12日</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">
            💡
            有給残日数は毎年4月1日に更新されます。詳細は人事部にお問い合わせください。
          </p>
        </div>
      </div>
    </div>
  );
}
