'use client';

import { useState } from 'react';
import Link from 'next/link';

// 型定義
interface UserProfile {
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  department?: string;
  birthDate?: string;
  gender?: string;
  joinDate: string;
  address?: string;
  emergencyContacts: EmergencyContact[];
  bankAccount?: BankAccount;
  socialInsurance?: SocialInsurance;
}

interface EmergencyContact {
  name: string;
  relationship: string;
  phoneNumber: string;
}

interface BankAccount {
  bankName: string;
  branchName: string;
  accountNumber: string;
  accountType: string;
}

interface SocialInsurance {
  healthInsuranceNumber: string;
  pensionNumber: string;
}

interface AttendanceRecord {
  date: string;
  clockIn: string;
  clockOut: string;
  breakTime: string;
  workingHours: string;
  status: 'normal' | 'late' | 'early' | 'absent';
}

interface ApplicationHistory {
  id: string;
  type: 'expense' | 'allowance' | 'paid-leave';
  title: string;
  amount?: number;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
}

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<
    'profile' | 'attendance' | 'applications' | 'payslip'
  >('profile');

  // ダミーデータ
  const userProfile: UserProfile = {
    employeeId: 'EMP001',
    firstName: '太郎',
    lastName: '田中',
    email: 'tanaka@functional-lab.com',
    role: '正社員',
    department: '開発部',
    birthDate: '1990-05-15',
    gender: '男性',
    joinDate: '2022-04-01',
    address: '東京都渋谷区神宮前1-1-1',
    emergencyContacts: [
      {
        name: '田中 花子',
        relationship: '配偶者',
        phoneNumber: '090-1234-5678',
      },
    ],
    bankAccount: {
      bankName: '三菱UFJ銀行',
      branchName: '渋谷支店',
      accountNumber: '1234567',
      accountType: '普通預金',
    },
    socialInsurance: {
      healthInsuranceNumber: '12345678',
      pensionNumber: '1234-567890',
    },
  };

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

  const applicationHistory: ApplicationHistory[] = [
    {
      id: '1',
      type: 'expense',
      title: '交通費申請（出張）',
      amount: 5000,
      date: '2024-12-18',
      status: 'approved',
    },
    {
      id: '2',
      type: 'paid-leave',
      title: '有給休暇申請',
      date: '2024-12-15',
      status: 'pending',
    },
    {
      id: '3',
      type: 'allowance',
      title: '残業手当申請',
      amount: 15000,
      date: '2024-12-10',
      status: 'approved',
    },
  ];

  const getStatusBadge = (status: string) => {
    const statusMap = {
      normal: { bg: 'bg-green-100', text: 'text-green-800', label: '正常' },
      late: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: '遅刻' },
      early: { bg: 'bg-blue-100', text: 'text-blue-800', label: '早退' },
      absent: { bg: 'bg-red-100', text: 'text-red-800', label: '欠勤' },
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

  const tabs = [
    { id: 'profile', name: '基本情報', icon: '👤' },
    { id: 'attendance', name: '勤怠履歴', icon: '⏰' },
    { id: 'applications', name: '申請履歴', icon: '📋' },
    { id: 'payslip', name: '給与明細', icon: '💰' },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      {/* ヘッダー */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              マイページ
            </h1>
            <p className="text-gray-600">
              {userProfile.lastName} {userProfile.firstName}さんの個人情報
            </p>
          </div>
          <Link
            href="/dashboard/profile/edit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            プロフィール編集
          </Link>
        </div>
      </div>

      {/* プロフィールカード */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div className="flex items-center">
          <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-3xl text-white font-bold">
              {userProfile.lastName.charAt(0)}
            </span>
          </div>
          <div className="ml-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {userProfile.lastName} {userProfile.firstName}
            </h2>
            <p className="text-gray-600 mb-1">
              社員番号: {userProfile.employeeId}
            </p>
            <p className="text-gray-600 mb-1">
              {userProfile.department} - {userProfile.role}
            </p>
            <p className="text-gray-600">{userProfile.email}</p>
          </div>
        </div>
      </div>

      {/* タブナビゲーション */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
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
        {activeTab === 'profile' && (
          <div className="p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-6">基本情報</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  氏名
                </label>
                <p className="text-gray-900">
                  {userProfile.lastName} {userProfile.firstName}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  社員番号
                </label>
                <p className="text-gray-900">{userProfile.employeeId}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  メールアドレス
                </label>
                <p className="text-gray-900">{userProfile.email}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  所属部署
                </label>
                <p className="text-gray-900">{userProfile.department}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  生年月日
                </label>
                <p className="text-gray-900">{userProfile.birthDate}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  性別
                </label>
                <p className="text-gray-900">{userProfile.gender}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  入社日
                </label>
                <p className="text-gray-900">{userProfile.joinDate}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  現住所
                </label>
                <p className="text-gray-900">{userProfile.address}</p>
              </div>
            </div>

            {/* 緊急連絡先 */}
            <div className="mt-8">
              <h4 className="text-md font-bold text-gray-900 mb-4">
                緊急連絡先
              </h4>
              {userProfile.emergencyContacts.map((contact, index) => (
                <div key={index} className="border rounded-lg p-4 mb-3">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        お名前
                      </label>
                      <p className="text-gray-900">{contact.name}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        続柄
                      </label>
                      <p className="text-gray-900">{contact.relationship}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        電話番号
                      </label>
                      <p className="text-gray-900">{contact.phoneNumber}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* 銀行口座情報 */}
            {userProfile.bankAccount && (
              <div className="mt-8">
                <h4 className="text-md font-bold text-gray-900 mb-4">
                  給与振込口座
                </h4>
                <div className="border rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        銀行名
                      </label>
                      <p className="text-gray-900">
                        {userProfile.bankAccount.bankName}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        支店名
                      </label>
                      <p className="text-gray-900">
                        {userProfile.bankAccount.branchName}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        口座番号
                      </label>
                      <p className="text-gray-900">
                        {userProfile.bankAccount.accountNumber}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        口座種別
                      </label>
                      <p className="text-gray-900">
                        {userProfile.bankAccount.accountType}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 社会保険情報 */}
            {userProfile.socialInsurance && (
              <div className="mt-8">
                <h4 className="text-md font-bold text-gray-900 mb-4">
                  社会保険情報
                </h4>
                <div className="border rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        健康保険番号
                      </label>
                      <p className="text-gray-900">
                        {userProfile.socialInsurance.healthInsuranceNumber}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        基礎年金番号
                      </label>
                      <p className="text-gray-900">
                        {userProfile.socialInsurance.pensionNumber}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'attendance' && (
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">勤怠履歴</h3>
              <Link
                href="/dashboard/attendance/history"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                詳細を見る →
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
                      出勤時刻
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      退勤時刻
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      休憩時間
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      勤務時間
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ステータス
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {attendanceRecords.map((record, index) => (
                    <tr key={index}>
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
        )}

        {activeTab === 'applications' && (
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">申請履歴</h3>
              <div className="space-x-4">
                <Link
                  href="/dashboard/expenses"
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  新規申請
                </Link>
              </div>
            </div>
            <div className="space-y-4">
              {applicationHistory.map((application) => (
                <div
                  key={application.id}
                  className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {application.title}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">
                        申請日: {application.date}
                        {application.amount && (
                          <span className="ml-4">
                            金額: ¥{application.amount.toLocaleString()}
                          </span>
                        )}
                      </p>
                    </div>
                    <div className="flex items-center">
                      {getStatusBadge(application.status)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'payslip' && (
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">給与明細</h3>
              <Link
                href="/dashboard/payslip"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                詳細を見る →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-blue-50 rounded-lg p-6">
                <div className="flex items-center">
                  <span className="text-2xl mr-3">💰</span>
                  <div>
                    <p className="text-sm font-medium text-blue-700">
                      今月の基本給
                    </p>
                    <p className="text-2xl font-bold text-blue-900">¥300,000</p>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 rounded-lg p-6">
                <div className="flex items-center">
                  <span className="text-2xl mr-3">💸</span>
                  <div>
                    <p className="text-sm font-medium text-green-700">
                      手取り額
                    </p>
                    <p className="text-2xl font-bold text-green-900">
                      ¥240,000
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 rounded-lg p-6">
                <div className="flex items-center">
                  <span className="text-2xl mr-3">📊</span>
                  <div>
                    <p className="text-sm font-medium text-yellow-700">
                      各種控除
                    </p>
                    <p className="text-2xl font-bold text-yellow-900">
                      ¥60,000
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                💡
                最新の給与明細は毎月25日に更新されます。詳細な内訳は「詳細を見る」からご確認ください。
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
