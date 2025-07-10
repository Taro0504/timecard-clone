'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FaPlus, FaCheckCircle } from 'react-icons/fa';

// 型定義
interface Employee {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'admin' | 'employee';
  department: string;
  position: string;
  joinDate: string;
  status: 'active' | 'inactive';
  phoneNumber: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phoneNumber: string;
  };
}

export default function AdminUsersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // ダミーデータ
  const employees: Employee[] = [
    {
      id: '1',
      employeeId: 'EMP001',
      firstName: '太郎',
      lastName: '田中',
      email: 'tanaka@functional-lab.com',
      role: 'employee',
      department: '開発部',
      position: 'エンジニア',
      joinDate: '2022-04-01',
      status: 'active',
      phoneNumber: '090-1234-5678',
      emergencyContact: {
        name: '田中 花子',
        relationship: '配偶者',
        phoneNumber: '090-8765-4321',
      },
    },
    {
      id: '2',
      employeeId: 'EMP002',
      firstName: '花子',
      lastName: '佐藤',
      email: 'sato@functional-lab.com',
      role: 'admin',
      department: '人事部',
      position: 'マネージャー',
      joinDate: '2021-06-15',
      status: 'active',
      phoneNumber: '090-2345-6789',
      emergencyContact: {
        name: '佐藤 次郎',
        relationship: '配偶者',
        phoneNumber: '090-9876-5432',
      },
    },
    {
      id: '3',
      employeeId: 'EMP003',
      firstName: '次郎',
      lastName: '鈴木',
      email: 'suzuki@functional-lab.com',
      role: 'employee',
      department: '営業部',
      position: '営業担当',
      joinDate: '2023-01-10',
      status: 'active',
      phoneNumber: '090-3456-7890',
      emergencyContact: {
        name: '鈴木 美咲',
        relationship: '配偶者',
        phoneNumber: '090-8765-4321',
      },
    },
    {
      id: '4',
      employeeId: 'EMP004',
      firstName: '美咲',
      lastName: '高橋',
      email: 'takahashi@functional-lab.com',
      role: 'employee',
      department: '開発部',
      position: 'デザイナー',
      joinDate: '2022-09-01',
      status: 'inactive',
      phoneNumber: '090-4567-8901',
      emergencyContact: {
        name: '高橋 健一',
        relationship: '配偶者',
        phoneNumber: '090-7654-3210',
      },
    },
  ];

  // フィルタリング
  const filteredEmployees = employees.filter((employee) => {
    const matchesSearch =
      employee.firstName.includes(searchTerm) ||
      employee.lastName.includes(searchTerm) ||
      employee.employeeId.includes(searchTerm) ||
      employee.email.includes(searchTerm);

    const matchesDepartment =
      !departmentFilter || employee.department === departmentFilter;
    const matchesRole = !roleFilter || employee.role === roleFilter;
    const matchesStatus = !statusFilter || employee.status === statusFilter;

    return matchesSearch && matchesDepartment && matchesRole && matchesStatus;
  });

  // 部署一覧（重複を除去）
  const departments = [...new Set(employees.map((emp) => emp.department))];

  const getRoleBadge = (role: string) => {
    const roleMap = {
      admin: {
        bg: 'bg-purple-100',
        text: 'text-purple-800',
        label: '管理者',
      },
      employee: {
        bg: 'bg-blue-100',
        text: 'text-blue-800',
        label: '正社員',
      },
    };

    const config = roleMap[role as keyof typeof roleMap];
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}
      >
        {config.label}
      </span>
    );
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      active: {
        bg: 'bg-green-100',
        text: 'text-green-800',
        label: '在籍',
      },
      inactive: {
        bg: 'bg-red-100',
        text: 'text-red-800',
        label: '退職',
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

  return (
    <div className="max-w-7xl mx-auto">
      {/* ヘッダー */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">社員管理</h1>
          <p className="text-gray-600">社員情報の確認と管理を行います。</p>
        </div>
        <div className="flex items-center space-x-4">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
            <FaPlus className="mr-2 inline" />
            新規社員登録
          </button>
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors">
            <span className="mr-2">📊</span>
            エクスポート
          </button>
        </div>
      </div>

      {/* 統計情報 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-blue-50 rounded-xl p-6">
          <div className="flex items-center">
            <span className="text-blue-500 text-2xl mr-3">👥</span>
            <div>
              <p className="text-sm font-medium text-blue-700">総社員数</p>
              <p className="text-2xl font-bold text-blue-900">
                {employees.length}名
              </p>
            </div>
          </div>
        </div>

        <div className="bg-green-50 rounded-xl p-6">
          <div className="flex items-center">
            <FaCheckCircle className="text-green-500 text-2xl mr-3" />
            <div>
              <p className="text-green-700 font-medium">
                社員登録が完了しました
              </p>
              <p className="text-green-600 text-sm">
                新しい社員がシステムに追加されました
              </p>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 rounded-xl p-6">
          <div className="flex items-center">
            <span className="text-purple-500 text-2xl mr-3">👑</span>
            <div>
              <p className="text-sm font-medium text-purple-700">管理者</p>
              <p className="text-2xl font-bold text-purple-900">
                {employees.filter((emp) => emp.role === 'admin').length}名
              </p>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 rounded-xl p-6">
          <div className="flex items-center">
            <span className="text-yellow-500 text-2xl mr-3">📅</span>
            <div>
              <p className="text-sm font-medium text-yellow-700">今月入社</p>
              <p className="text-2xl font-bold text-yellow-900">
                {
                  employees.filter((emp) => {
                    const joinDate = new Date(emp.joinDate);
                    const now = new Date();
                    return (
                      joinDate.getMonth() === now.getMonth() &&
                      joinDate.getFullYear() === now.getFullYear()
                    );
                  }).length
                }
                名
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 検索・フィルタ */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* 検索 */}
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              検索
            </label>
            <input
              type="text"
              placeholder="社員名、社員番号、メールアドレス..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* 部署フィルタ */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              部署
            </label>
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">全て</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          {/* ロールフィルタ */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ロール
            </label>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">全て</option>
              <option value="admin">管理者</option>
              <option value="employee">正社員</option>
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
              <option value="active">在籍</option>
              <option value="inactive">退職</option>
            </select>
          </div>
        </div>
      </div>

      {/* 社員一覧 */}
      <div className="bg-white rounded-xl shadow-lg">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-900">
            社員一覧 ({filteredEmployees.length}名)
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  社員情報
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  部署・役職
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  連絡先
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  入社日
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ロール・ステータス
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredEmployees.map((employee) => (
                <tr key={employee.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-medium">
                          {employee.lastName.charAt(0)}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {employee.lastName} {employee.firstName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {employee.employeeId}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {employee.department}
                    </div>
                    <div className="text-sm text-gray-500">
                      {employee.position}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {employee.email}
                    </div>
                    <div className="text-sm text-gray-500">
                      {employee.phoneNumber}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(employee.joinDate)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-1">
                      {getRoleBadge(employee.role)}
                      {getStatusBadge(employee.status)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <Link
                        href={`/dashboard/mypage?employeeId=${employee.id}`}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        詳細
                      </Link>
                      <button className="text-green-600 hover:text-green-700">
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

        {filteredEmployees.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">👥</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              該当する社員が見つかりません
            </h3>
            <p className="text-gray-600 mb-6">
              検索条件を変更してお試しください。
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
