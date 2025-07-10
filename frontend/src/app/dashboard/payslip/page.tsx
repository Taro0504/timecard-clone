'use client';

import { useState } from 'react';
import Link from 'next/link';

// 型定義
interface PayslipItem {
  id: string;
  year: number;
  month: number;
  basicSalary: number;
  allowances: {
    overtime: number;
    transportation: number;
    housing: number;
    other: number;
  };
  deductions: {
    healthInsurance: number;
    pension: number;
    employmentInsurance: number;
    incomeTax: number;
    residenceTax: number;
    other: number;
  };
  netSalary: number;
  workingDays: number;
  overtimeHours: number;
  status: 'available' | 'pending' | 'unavailable';
}

export default function PayslipPage() {
  const [selectedYear, setSelectedYear] = useState(2024);
  const [selectedMonth, setSelectedMonth] = useState(12);

  // ダミーデータ
  const payslipData: PayslipItem = {
    id: '1',
    year: 2024,
    month: 12,
    basicSalary: 300000,
    allowances: {
      overtime: 25000,
      transportation: 15000,
      housing: 20000,
      other: 5000,
    },
    deductions: {
      healthInsurance: 15000,
      pension: 27000,
      employmentInsurance: 1800,
      incomeTax: 12000,
      residenceTax: 10000,
      other: 2000,
    },
    netSalary: 240000,
    workingDays: 22,
    overtimeHours: 20,
    status: 'available',
  };

  // 手当合計
  const totalAllowances = Object.values(payslipData.allowances).reduce(
    (sum, amount) => sum + amount,
    0
  );

  // 控除合計
  const totalDeductions = Object.values(payslipData.deductions).reduce(
    (sum, amount) => sum + amount,
    0
  );

  // 総支給額
  const grossSalary = payslipData.basicSalary + totalAllowances;

  const formatCurrency = (amount: number) => {
    return `¥${amount.toLocaleString()}`;
  };

  const formatDate = (year: number, month: number) => {
    return `${year}年${month}月`;
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      available: {
        bg: 'bg-green-100',
        text: 'text-green-800',
        label: '確認可能',
      },
      pending: {
        bg: 'bg-yellow-100',
        text: 'text-yellow-800',
        label: '準備中',
      },
      unavailable: {
        bg: 'bg-gray-100',
        text: 'text-gray-800',
        label: '未公開',
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

  // 利用可能な年月の選択肢
  const availableYears = [2024, 2023];
  const availableMonths = Array.from({ length: 12 }, (_, i) => i + 1);

  return (
    <div className="max-w-6xl mx-auto">
      {/* ヘッダー */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">給与明細</h1>
          <p className="text-gray-600">
            給与明細の確認とダウンロードができます。
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors">
            <span className="mr-2">📄</span>
            PDFダウンロード
          </button>
        </div>
      </div>

      {/* 月別選択 */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700">年:</label>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            {availableYears.map((year) => (
              <option key={year} value={year}>
                {year}年
              </option>
            ))}
          </select>

          <label className="text-sm font-medium text-gray-700">月:</label>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            {availableMonths.map((month) => (
              <option key={month} value={month}>
                {month}月
              </option>
            ))}
          </select>

          <div className="ml-4">{getStatusBadge(payslipData.status)}</div>
        </div>
      </div>

      {/* 給与サマリー */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-blue-50 rounded-xl p-6">
          <div className="flex items-center">
            <span className="text-blue-500 text-2xl mr-3">💰</span>
            <div>
              <p className="text-sm font-medium text-blue-700">基本給</p>
              <p className="text-2xl font-bold text-blue-900">
                {formatCurrency(payslipData.basicSalary)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-green-50 rounded-xl p-6">
          <div className="flex items-center">
            <span className="text-green-500 text-2xl mr-3">💸</span>
            <div>
              <p className="text-sm font-medium text-green-700">総支給額</p>
              <p className="text-2xl font-bold text-green-900">
                {formatCurrency(grossSalary)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-red-50 rounded-xl p-6">
          <div className="flex items-center">
            <span className="text-red-500 text-2xl mr-3">📉</span>
            <div>
              <p className="text-sm font-medium text-red-700">控除合計</p>
              <p className="text-2xl font-bold text-red-900">
                {formatCurrency(totalDeductions)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 rounded-xl p-6">
          <div className="flex items-center">
            <span className="text-purple-500 text-2xl mr-3">💳</span>
            <div>
              <p className="text-sm font-medium text-purple-700">手取り額</p>
              <p className="text-2xl font-bold text-purple-900">
                {formatCurrency(payslipData.netSalary)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 勤怠情報 */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h3 className="text-lg font-bold text-gray-900 mb-4">勤怠情報</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <p className="text-sm text-gray-600">勤務日数</p>
            <p className="text-2xl font-bold text-gray-900">
              {payslipData.workingDays}日
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">残業時間</p>
            <p className="text-2xl font-bold text-gray-900">
              {payslipData.overtimeHours}時間
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">平均勤務時間</p>
            <p className="text-2xl font-bold text-gray-900">
              {Math.round(
                (payslipData.overtimeHours / payslipData.workingDays) * 10
              ) / 10}
              時間/日
            </p>
          </div>
        </div>
      </div>

      {/* 給与詳細 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 支給項目 */}
        <div className="bg-white rounded-xl shadow-lg">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-bold text-gray-900">支給項目</h3>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-700">基本給</span>
              <span className="font-medium text-gray-900">
                {formatCurrency(payslipData.basicSalary)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700">残業手当</span>
              <span className="font-medium text-gray-900">
                {formatCurrency(payslipData.allowances.overtime)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700">通勤手当</span>
              <span className="font-medium text-gray-900">
                {formatCurrency(payslipData.allowances.transportation)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700">住宅手当</span>
              <span className="font-medium text-gray-900">
                {formatCurrency(payslipData.allowances.housing)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700">その他手当</span>
              <span className="font-medium text-gray-900">
                {formatCurrency(payslipData.allowances.other)}
              </span>
            </div>
            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-900">支給合計</span>
                <span className="font-bold text-lg text-gray-900">
                  {formatCurrency(grossSalary)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 控除項目 */}
        <div className="bg-white rounded-xl shadow-lg">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-bold text-gray-900">控除項目</h3>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-700">健康保険料</span>
              <span className="font-medium text-gray-900">
                {formatCurrency(payslipData.deductions.healthInsurance)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700">厚生年金保険料</span>
              <span className="font-medium text-gray-900">
                {formatCurrency(payslipData.deductions.pension)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700">雇用保険料</span>
              <span className="font-medium text-gray-900">
                {formatCurrency(payslipData.deductions.employmentInsurance)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700">所得税</span>
              <span className="font-medium text-gray-900">
                {formatCurrency(payslipData.deductions.incomeTax)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700">住民税</span>
              <span className="font-medium text-gray-900">
                {formatCurrency(payslipData.deductions.residenceTax)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700">その他控除</span>
              <span className="font-medium text-gray-900">
                {formatCurrency(payslipData.deductions.other)}
              </span>
            </div>
            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-900">控除合計</span>
                <span className="font-bold text-lg text-gray-900">
                  {formatCurrency(totalDeductions)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 注意事項 */}
      <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start">
          <span className="text-yellow-500 text-lg mr-3 mt-0.5">⚠️</span>
          <div>
            <h4 className="text-sm font-medium text-yellow-900 mb-2">
              給与明細に関する注意事項
            </h4>
            <ul className="text-xs text-yellow-800 space-y-1">
              <li>• 給与明細は毎月25日に更新されます</li>
              <li>• 控除項目は法律に基づいて計算されています</li>
              <li>• 手当は勤務実績に応じて変動する場合があります</li>
              <li>• ご不明な点がございましたら人事部にお問い合わせください</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
