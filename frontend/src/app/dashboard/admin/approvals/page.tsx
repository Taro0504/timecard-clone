'use client';

import { useState } from 'react';
import {
  FaCheckCircle,
  FaTimesCircle,
  FaChartBar,
  FaClipboardList,
  FaMoneyBill,
  FaBriefcase,
  FaCalendarAlt,
  FaClock,
} from 'react-icons/fa';

// 型定義
interface ApprovalItem {
  id: string;
  type: 'expense' | 'allowance' | 'paid-leave';
  employeeId: string;
  employeeName: string;
  department: string;
  title: string;
  amount?: number;
  startDate?: string;
  endDate?: string;
  reason: string;
  applicationDate: string;
  status: 'pending' | 'approved' | 'rejected';
}

export default function AdminApprovalsPage() {
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // ダミーデータ
  const approvals: ApprovalItem[] = [
    {
      id: '1',
      type: 'expense',
      employeeId: 'EMP001',
      employeeName: '田中 太郎',
      department: '開発部',
      title: '交通費申請（出張）',
      amount: 5000,
      reason: '東京でのクライアントミーティング参加のため',
      applicationDate: '2024-12-18',
      status: 'pending',
    },
    {
      id: '2',
      type: 'allowance',
      employeeId: 'EMP003',
      employeeName: '鈴木 次郎',
      department: '営業部',
      title: '残業手当申請',
      amount: 15000,
      reason: 'プロジェクト納期のため、月20時間の残業を実施',
      applicationDate: '2024-12-15',
      status: 'pending',
    },
    {
      id: '3',
      type: 'paid-leave',
      employeeId: 'EMP001',
      employeeName: '田中 太郎',
      department: '開発部',
      title: '有給休暇申請',
      startDate: '2024-12-25',
      endDate: '2024-12-27',
      reason: '年末年始の家族旅行のため',
      applicationDate: '2024-12-10',
      status: 'approved',
    },
    {
      id: '4',
      type: 'expense',
      employeeId: 'EMP004',
      employeeName: '高橋 美咲',
      department: '開発部',
      title: '備品購入費',
      amount: 8000,
      reason: '開発用の新しいキーボード購入',
      applicationDate: '2024-12-12',
      status: 'rejected',
    },
  ];

  // フィルタリング
  const filteredApprovals = approvals.filter((approval) => {
    const matchesType = !typeFilter || approval.type === typeFilter;
    const matchesStatus = !statusFilter || approval.status === statusFilter;
    return matchesType && matchesStatus;
  });

  const getTypeBadge = (type: string) => {
    const typeMap = {
      expense: {
        bg: 'bg-blue-100',
        text: 'text-blue-800',
        label: '経費申請',
        icon: FaMoneyBill,
      },
      allowance: {
        bg: 'bg-green-100',
        text: 'text-green-800',
        label: '手当申請',
        icon: FaBriefcase,
      },
      'paid-leave': {
        bg: 'bg-purple-100',
        text: 'text-purple-800',
        label: '有給申請',
        icon: FaCalendarAlt,
      },
    };

    const config = typeMap[type as keyof typeof typeMap];
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}
      >
        <config.icon className="mr-1" />
        {config.label}
      </span>
    );
  };

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
      rejected: {
        bg: 'bg-red-100',
        text: 'text-red-800',
        label: '却下',
      },
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

  const formatCurrency = (amount: number) => {
    return `¥${amount.toLocaleString()}`;
  };

  const handleApprove = (id: string) => {
    console.log('承認:', id);
    // TODO: 実際の承認処理をここに実装
  };

  const handleReject = (id: string) => {
    console.log('却下:', id);
    // TODO: 実際の却下処理をここに実装
  };

  // 統計情報
  const pendingCount = approvals.filter((a) => a.status === 'pending').length;
  const approvedCount = approvals.filter((a) => a.status === 'approved').length;
  const rejectedCount = approvals.filter((a) => a.status === 'rejected').length;

  return (
    <div className="max-w-7xl mx-auto">
      {/* ヘッダー */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">申請承認</h1>
          <p className="text-gray-600">
            社員からの各種申請の承認・却下を行います。
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
            <FaChartBar className="mr-2" />
            承認履歴
          </button>
        </div>
      </div>

      {/* 統計情報 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-blue-50 rounded-xl p-6">
          <div className="flex items-center">
            <FaClipboardList className="text-blue-500 text-2xl mr-3" />
            <div>
              <p className="text-sm font-medium text-blue-700">総申請数</p>
              <p className="text-2xl font-bold text-blue-900">
                {approvals.length}件
              </p>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 rounded-xl p-6">
          <div className="flex items-center">
            <FaClock className="text-yellow-500 text-2xl mr-3" />
            <div>
              <p className="text-sm font-medium text-yellow-700">承認待ち</p>
              <p className="text-2xl font-bold text-yellow-900">
                {pendingCount}件
              </p>
            </div>
          </div>
        </div>

        <div className="bg-green-50 rounded-xl p-6">
          <div className="flex items-center">
            <FaCheckCircle className="text-green-500 text-2xl mr-3" />
            <div>
              <p className="text-sm font-medium text-green-700">承認済み</p>
              <p className="text-2xl font-bold text-green-900">
                {approvedCount}件
              </p>
            </div>
          </div>
        </div>

        <div className="bg-red-50 rounded-xl p-6">
          <div className="flex items-center">
            <FaTimesCircle className="text-red-500 text-2xl mr-3" />
            <div>
              <p className="text-sm font-medium text-red-700">却下</p>
              <p className="text-2xl font-bold text-red-900">
                {rejectedCount}件
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* フィルタ */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* 申請種別フィルタ */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              申請種別
            </label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">全て</option>
              <option value="expense">経費申請</option>
              <option value="allowance">手当申請</option>
              <option value="paid-leave">有給申請</option>
            </select>
          </div>

          {/* ステータスフィルタ */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ステータス
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">全て</option>
              <option value="pending">承認待ち</option>
              <option value="approved">承認済み</option>
              <option value="rejected">却下</option>
            </select>
          </div>

          {/* リセットボタン */}
          <div className="flex items-end">
            <button
              onClick={() => {
                setTypeFilter('');
                setStatusFilter('');
              }}
              className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors"
            >
              フィルタリセット
            </button>
          </div>
        </div>
      </div>

      {/* 申請一覧 */}
      <div className="bg-white rounded-xl shadow-lg">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-900">
            申請一覧 ({filteredApprovals.length}件)
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  申請情報
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  申請者
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  詳細
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  申請日
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ステータス
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredApprovals.map((approval) => (
                <tr key={approval.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        {getTypeBadge(approval.type)}
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">
                          {approval.title}
                        </div>
                        {approval.amount && (
                          <div className="text-sm text-gray-500">
                            {formatCurrency(approval.amount)}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {approval.employeeName}
                    </div>
                    <div className="text-sm text-gray-500">
                      {approval.department}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-xs truncate">
                      {approval.reason}
                    </div>
                    {approval.startDate && approval.endDate && (
                      <div className="text-sm text-gray-500">
                        {formatDate(approval.startDate)} 〜{' '}
                        {formatDate(approval.endDate)}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(approval.applicationDate)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(approval.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {approval.status === 'pending' ? (
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleApprove(approval.id)}
                          className="text-green-600 hover:text-green-700 bg-green-50 px-3 py-1 rounded-md hover:bg-green-100 transition-colors"
                        >
                          承認
                        </button>
                        <button
                          onClick={() => handleReject(approval.id)}
                          className="text-red-600 hover:text-red-700 bg-red-50 px-3 py-1 rounded-md hover:bg-red-100 transition-colors"
                        >
                          却下
                        </button>
                      </div>
                    ) : (
                      <span className="text-gray-500">処理済み</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredApprovals.length === 0 && (
          <div className="text-center py-12">
            <FaClipboardList className="text-gray-400 text-6xl mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              該当する申請が見つかりません
            </h3>
            <p className="text-gray-600 mb-6">
              フィルタ条件を変更してお試しください。
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
