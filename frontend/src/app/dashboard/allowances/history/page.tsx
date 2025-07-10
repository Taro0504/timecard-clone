'use client';

import Link from 'next/link';
import { FaClipboardList } from 'react-icons/fa';

// 型定義
interface AllowanceHistory {
  id: string;
  allowanceName: string;
  allowanceType: string;
  amount: number;
  reason: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
}

export default function AllowanceHistoryPage() {
  // ダミーデータ
  const allowanceHistory: AllowanceHistory[] = [
    {
      id: '1',
      allowanceName: '東京出張手当',
      allowanceType: '出張手当',
      amount: 5000,
      reason: '東京でのクライアントミーティング参加のため',
      date: '2024-12-18',
      status: 'approved',
    },
    {
      id: '2',
      allowanceName: '残業手当',
      allowanceType: '残業手当',
      amount: 15000,
      reason: 'プロジェクト納期のため、月20時間の残業を実施',
      date: '2024-12-15',
      status: 'pending',
    },
    {
      id: '3',
      allowanceName: '深夜手当',
      allowanceType: '深夜手当',
      amount: 8000,
      reason: 'システムメンテナンスのため深夜作業を実施',
      date: '2024-12-10',
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

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            その他手当申請履歴
          </h1>
          <p className="text-gray-600">過去の手当申請の履歴を確認できます。</p>
        </div>
        <Link
          href="/dashboard/allowances"
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
                    手当ての名称
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    手当種別
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    金額
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
                {allowanceHistory.map((allowance) => (
                  <tr key={allowance.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {allowance.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {allowance.allowanceName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {allowance.allowanceType}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ¥{allowance.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                      {allowance.reason}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(allowance.status)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {allowanceHistory.length === 0 && (
            <div className="text-center py-12">
              <FaClipboardList className="text-gray-400 text-6xl mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                申請履歴がありません
              </h3>
              <p className="text-gray-600 mb-6">
                まだ手当申請を行っていません。
              </p>
              <Link
                href="/dashboard/allowances"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                初回申請を行う
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
