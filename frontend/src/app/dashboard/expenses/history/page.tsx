'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';

interface ExpenseHistory {
  id: string;
  date: string;
  name: string;
  purpose: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
}

const allExpenseRecords: ExpenseHistory[] = [
  {
    id: 'EXP001',
    date: '2024-12-20',
    name: '新幹線代（東京-大阪）',
    purpose: '出張費',
    amount: 28000,
    status: 'approved',
  },
  {
    id: 'EXP002',
    date: '2024-12-18',
    name: '接待交際費（〇〇商事）',
    purpose: '接待交際費',
    amount: 15000,
    status: 'approved',
  },
  {
    id: 'EXP003',
    date: '2024-12-15',
    name: 'キーボード・マウス購入',
    purpose: '備品・消耗品費',
    amount: 8500,
    status: 'pending',
  },
  {
    id: 'EXP004',
    date: '2024-12-12',
    name: 'タクシー代',
    purpose: '交通費',
    amount: 3200,
    status: 'rejected',
  },
  {
    id: 'EXP005',
    date: '2024-12-10',
    name: '書籍購入（技術書）',
    purpose: 'その他',
    amount: 4500,
    status: 'approved',
  },
];

export default function ExpenseHistoryPage() {
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredRecords = useMemo(() => {
    if (filterStatus === 'all') {
      return allExpenseRecords;
    }
    return allExpenseRecords.filter((record) => record.status === filterStatus);
  }, [filterStatus]);

  const getStatusBadge = (status: ExpenseHistory['status']) => {
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
    const config = statusMap[status];
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
            経費申請履歴
          </h1>
          <p className="text-gray-600">過去の経費申請を一覧で確認できます。</p>
        </div>
        <Link
          href="/dashboard/expenses"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          新規申請を行う
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <div className="flex items-center gap-4">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border rounded-lg px-3 py-2"
            >
              <option value="all">すべてのステータス</option>
              <option value="pending">承認待ち</option>
              <option value="approved">承認済み</option>
              <option value="rejected">却下</option>
            </select>
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
                  申請日
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  経費名称
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  用途
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  金額
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ステータス
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRecords.map((record) => (
                <tr key={record.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {record.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {record.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {record.purpose}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                    ¥{record.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
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
