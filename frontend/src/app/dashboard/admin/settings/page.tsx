'use client';

import { useState } from 'react';

// 型定義
interface Department {
  id: string;
  name: string;
  code: string;
  manager: string;
  employeeCount: number;
  status: 'active' | 'inactive';
}

interface SystemSetting {
  key: string;
  value: string;
  description: string;
  category: 'general' | 'notification' | 'security' | 'approval';
}

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<
    'general' | 'departments' | 'notifications' | 'security'
  >('general');

  // 部署データ
  const departments: Department[] = [
    {
      id: '1',
      name: '開発部',
      code: 'DEV',
      manager: '田中 太郎',
      employeeCount: 15,
      status: 'active',
    },
    {
      id: '2',
      name: '営業部',
      code: 'SALES',
      manager: '鈴木 次郎',
      employeeCount: 8,
      status: 'active',
    },
    {
      id: '3',
      name: '人事部',
      code: 'HR',
      manager: '佐藤 花子',
      employeeCount: 3,
      status: 'active',
    },
    {
      id: '4',
      name: '経理部',
      code: 'ACCOUNT',
      manager: '高橋 美咲',
      employeeCount: 4,
      status: 'inactive',
    },
  ];

  // システム設定データ
  const systemSettings: SystemSetting[] = [
    {
      key: 'company_name',
      value: 'FunctionalLab株式会社',
      description: '会社名',
      category: 'general',
    },
    {
      key: 'work_start_time',
      value: '09:00',
      description: '標準勤務開始時間',
      category: 'general',
    },
    {
      key: 'work_end_time',
      value: '18:00',
      description: '標準勤務終了時間',
      category: 'general',
    },
    {
      key: 'overtime_threshold',
      value: '8',
      description: '残業時間の閾値（時間）',
      category: 'general',
    },
    {
      key: 'expense_approval_limit',
      value: '50000',
      description: '経費申請の承認上限（円）',
      category: 'approval',
    },
    {
      key: 'leave_advance_notice',
      value: '3',
      description: '有給申請の事前通知日数',
      category: 'approval',
    },
    {
      key: 'email_notifications',
      value: 'true',
      description: 'メール通知の有効化',
      category: 'notification',
    },
    {
      key: 'slack_notifications',
      value: 'false',
      description: 'Slack通知の有効化',
      category: 'notification',
    },
    {
      key: 'password_expiry_days',
      value: '90',
      description: 'パスワード有効期限（日）',
      category: 'security',
    },
    {
      key: 'session_timeout_minutes',
      value: '30',
      description: 'セッションタイムアウト（分）',
      category: 'security',
    },
  ];

  const getStatusBadge = (status: string) => {
    const statusMap = {
      active: {
        bg: 'bg-green-100',
        text: 'text-green-800',
        label: '有効',
      },
      inactive: {
        bg: 'bg-red-100',
        text: 'text-red-800',
        label: '無効',
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

  const tabs = [
    { id: 'general', name: '一般設定', icon: '⚙️' },
    { id: 'departments', name: '部署管理', icon: '🏢' },
    { id: 'notifications', name: '通知設定', icon: '🔔' },
    { id: 'security', name: 'セキュリティ', icon: '🔒' },
  ];

  const filteredSettings = systemSettings.filter((setting) => {
    if (activeTab === 'general') return setting.category === 'general';
    if (activeTab === 'notifications')
      return setting.category === 'notification';
    if (activeTab === 'security') return setting.category === 'security';
    return false;
  });

  return (
    <div className="max-w-7xl mx-auto">
      {/* ヘッダー */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">管理設定</h1>
          <p className="text-gray-600">システム全体の設定と管理を行います。</p>
        </div>
        <div className="flex items-center space-x-4">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
            <span className="mr-2">💾</span>
            設定を保存
          </button>
          <button className="px-4 py-2 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors">
            <span className="mr-2">🔄</span>
            設定をリセット
          </button>
        </div>
      </div>

      {/* タブナビゲーション */}
      <div className="mb-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() =>
                  setActiveTab(
                    tab.id as
                      | 'general'
                      | 'departments'
                      | 'notifications'
                      | 'security'
                  )
                }
                className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2 text-lg">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* タブコンテンツ */}
      <div className="bg-white rounded-xl shadow-lg">
        {activeTab === 'general' && (
          <div className="p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-6">一般設定</h3>
            <div className="space-y-6">
              {filteredSettings.map((setting) => (
                <div
                  key={setting.key}
                  className="border-b border-gray-200 pb-6 last:border-b-0"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {setting.description}
                      </label>
                      <p className="text-xs text-gray-500">
                        設定キー: {setting.key}
                      </p>
                    </div>
                    <div className="md:col-span-2">
                      <input
                        type="text"
                        value={setting.value}
                        onChange={() => {}}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'departments' && (
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-gray-900">部署管理</h3>
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors">
                <span className="mr-2">➕</span>
                新規部署追加
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      部署名
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      部署コード
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      部署長
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      社員数
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
                  {departments.map((department) => (
                    <tr key={department.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {department.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {department.code}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {department.manager}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {department.employeeCount}名
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(department.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button className="text-blue-600 hover:text-blue-700">
                            編集
                          </button>
                          <button className="text-red-600 hover:text-red-700">
                            削除
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-6">通知設定</h3>
            <div className="space-y-6">
              {filteredSettings.map((setting) => (
                <div
                  key={setting.key}
                  className="border-b border-gray-200 pb-6 last:border-b-0"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {setting.description}
                      </label>
                      <p className="text-xs text-gray-500">
                        設定キー: {setting.key}
                      </p>
                    </div>
                    <div className="md:col-span-2">
                      <select
                        value={setting.value}
                        onChange={() => {}}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="true">有効</option>
                        <option value="false">無効</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-6">
              セキュリティ設定
            </h3>
            <div className="space-y-6">
              {filteredSettings.map((setting) => (
                <div
                  key={setting.key}
                  className="border-b border-gray-200 pb-6 last:border-b-0"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {setting.description}
                      </label>
                      <p className="text-xs text-gray-500">
                        設定キー: {setting.key}
                      </p>
                    </div>
                    <div className="md:col-span-2">
                      <input
                        type="number"
                        value={setting.value}
                        onChange={() => {}}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* システム情報 */}
      <div className="mt-8 bg-gray-50 rounded-xl p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">システム情報</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg p-4">
            <p className="text-sm text-gray-600">システムバージョン</p>
            <p className="text-lg font-semibold text-gray-900">v1.0.0</p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <p className="text-sm text-gray-600">最終更新日</p>
            <p className="text-lg font-semibold text-gray-900">2024-12-20</p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <p className="text-sm text-gray-600">データベース</p>
            <p className="text-lg font-semibold text-gray-900">PostgreSQL 15</p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <p className="text-sm text-gray-600">稼働時間</p>
            <p className="text-lg font-semibold text-gray-900">99.9%</p>
          </div>
        </div>
      </div>
    </div>
  );
}
