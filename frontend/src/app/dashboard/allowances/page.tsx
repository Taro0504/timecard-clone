'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// バリデーションスキーマ
const allowanceSchema = z.object({
  allowanceName: z.string().min(1, '手当ての名称は必須です'),
  allowanceType: z.string().min(1, '手当種別を選択してください'),
  amount: z
    .number({ invalid_type_error: '金額を数字で入力してください' })
    .min(1, '金額は1円以上で入力してください'),
  reason: z.string().min(1, '理由を入力してください'),
});

type AllowanceFormData = z.infer<typeof allowanceSchema>;

const ALLOWANCE_TYPE_OPTIONS = [
  '出張手当',
  '残業手当',
  '深夜手当',
  '休日出勤手当',
  '通勤手当',
  '住宅手当',
  '家族手当',
  'その他',
];

export default function AllowancePage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<AllowanceFormData>({
    resolver: zodResolver(allowanceSchema),
  });

  const onSubmit = async (data: AllowanceFormData) => {
    setIsLoading(true);
    try {
      // TODO: 実際の申請処理をここに実装
      console.log('手当申請:', data);

      // シミュレーション: 2秒後に履歴ページにリダイレクト
      setTimeout(() => {
        setIsLoading(false);
        console.log('申請成功');
        router.push('/dashboard/allowances/history');
      }, 2000);
    } catch {
      setIsLoading(false);
      setError('root', {
        message: '申請に失敗しました。しばらく時間をおいて再度お試しください。',
      });
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            その他手当申請
          </h1>
          <p className="text-gray-600">各種手当の申請を行います。</p>
        </div>
        <Link
          href="/dashboard/allowances/history"
          className="text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          申請履歴を見る →
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-lg">
        <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6">
          {/* エラーメッセージ */}
          {errors.root && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
              <span className="text-red-700 text-sm">
                {errors.root.message}
              </span>
            </div>
          )}

          {/* 手当ての名称 */}
          <div>
            <label
              htmlFor="allowanceName"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              手当ての名称 <span className="text-red-500">*</span>
            </label>
            <input
              id="allowanceName"
              type="text"
              {...register('allowanceName')}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 ${
                errors.allowanceName
                  ? 'border-red-300 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-blue-500'
              }`}
              placeholder="例：東京出張手当"
              disabled={isLoading}
            />
            {errors.allowanceName && (
              <p className="mt-2 text-sm text-red-600">
                {errors.allowanceName.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 手当種別 */}
            <div>
              <label
                htmlFor="allowanceType"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                手当種別 <span className="text-red-500">*</span>
              </label>
              <select
                id="allowanceType"
                {...register('allowanceType')}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 ${
                  errors.allowanceType
                    ? 'border-red-300 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
                disabled={isLoading}
              >
                <option value="">選択してください</option>
                {ALLOWANCE_TYPE_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
              {errors.allowanceType && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.allowanceType.message}
                </p>
              )}
            </div>

            {/* 金額 */}
            <div>
              <label
                htmlFor="amount"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                金額 (円) <span className="text-red-500">*</span>
              </label>
              <input
                id="amount"
                type="number"
                {...register('amount', { valueAsNumber: true })}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 ${
                  errors.amount
                    ? 'border-red-300 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
                placeholder="例：5000"
                disabled={isLoading}
              />
              {errors.amount && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.amount.message}
                </p>
              )}
            </div>
          </div>

          {/* 理由 */}
          <div>
            <label
              htmlFor="reason"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              理由 <span className="text-red-500">*</span>
            </label>
            <textarea
              id="reason"
              {...register('reason')}
              rows={4}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 ${
                errors.reason
                  ? 'border-red-300 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-blue-500'
              }`}
              placeholder="手当申請の理由を詳しく記入してください"
              disabled={isLoading}
            />
            {errors.reason && (
              <p className="mt-2 text-sm text-red-600">
                {errors.reason.message}
              </p>
            )}
          </div>

          {/* 申請ボタン */}
          <div className="flex justify-end space-x-4 pt-6">
            <Link
              href="/dashboard"
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              キャンセル
            </Link>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? '申請中...' : '申請する'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
