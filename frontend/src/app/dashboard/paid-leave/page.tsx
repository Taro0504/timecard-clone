'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// バリデーションスキーマ
const paidLeaveSchema = z
  .object({
    startDate: z.string().min(1, '開始日を選択してください'),
    endDate: z.string().min(1, '終了日を選択してください'),
    reason: z.string().min(1, '理由を入力してください'),
    leaveType: z.string().min(1, '有給種別を選択してください'),
  })
  .refine(
    (data) => {
      const startDate = new Date(data.startDate);
      const endDate = new Date(data.endDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // 開始日は今日以降である必要がある
      if (startDate < today) {
        return false;
      }

      // 終了日は開始日以降である必要がある
      if (endDate < startDate) {
        return false;
      }

      return true;
    },
    {
      message:
        '日付の設定が正しくありません。開始日は今日以降、終了日は開始日以降に設定してください。',
    }
  );

type PaidLeaveFormData = z.infer<typeof paidLeaveSchema>;

const LEAVE_TYPE_OPTIONS = [
  '有給休暇',
  '特別休暇',
  '慶弔休暇',
  '夏季休暇',
  '冬季休暇',
  'その他',
];

export default function PaidLeavePage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    watch,
  } = useForm<PaidLeaveFormData>({
    resolver: zodResolver(paidLeaveSchema),
  });

  const startDate = watch('startDate');
  const endDate = watch('endDate');

  // 日数計算
  const calculateDays = () => {
    if (!startDate || !endDate) return 0;

    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays + 1; // 開始日も含める
  };

  const onSubmit = async (data: PaidLeaveFormData) => {
    setIsLoading(true);
    try {
      // TODO: 実際の申請処理をここに実装
      console.log('有給申請:', {
        ...data,
        days: calculateDays(),
        applicationDate: new Date().toISOString().split('T')[0],
      });

      // シミュレーション: 2秒後に履歴ページにリダイレクト
      setTimeout(() => {
        setIsLoading(false);
        console.log('申請成功');
        router.push('/dashboard/paid-leave/history');
      }, 2000);
    } catch {
      setIsLoading(false);
      setError('root', {
        message: '申請に失敗しました。しばらく時間をおいて再度お試しください。',
      });
    }
  };

  // 最小日付（今日）
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">有給申請</h1>
          <p className="text-gray-600">有給休暇の申請を行います。</p>
        </div>
        <Link
          href="/dashboard/paid-leave/history"
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

          {/* 有給種別 */}
          <div>
            <label
              htmlFor="leaveType"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              有給種別 <span className="text-red-500">*</span>
            </label>
            <select
              id="leaveType"
              {...register('leaveType')}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 ${
                errors.leaveType
                  ? 'border-red-300 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-blue-500'
              }`}
              disabled={isLoading}
            >
              <option value="">選択してください</option>
              {LEAVE_TYPE_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            {errors.leaveType && (
              <p className="mt-2 text-sm text-red-600">
                {errors.leaveType.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 開始日 */}
            <div>
              <label
                htmlFor="startDate"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                開始日 <span className="text-red-500">*</span>
              </label>
              <input
                id="startDate"
                type="date"
                {...register('startDate')}
                min={today}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 ${
                  errors.startDate
                    ? 'border-red-300 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
                disabled={isLoading}
              />
              {errors.startDate && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.startDate.message}
                </p>
              )}
            </div>

            {/* 終了日 */}
            <div>
              <label
                htmlFor="endDate"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                終了日 <span className="text-red-500">*</span>
              </label>
              <input
                id="endDate"
                type="date"
                {...register('endDate')}
                min={startDate || today}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 ${
                  errors.endDate
                    ? 'border-red-300 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
                disabled={isLoading}
              />
              {errors.endDate && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.endDate.message}
                </p>
              )}
            </div>
          </div>

          {/* 日数表示 */}
          {startDate && endDate && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center">
                <span className="text-blue-500 text-lg mr-3">📅</span>
                <div>
                  <p className="text-sm font-medium text-blue-900">
                    申請日数: {calculateDays()}日
                  </p>
                  <p className="text-xs text-blue-700 mt-1">
                    {startDate} 〜 {endDate}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 理由 */}
          <div>
            <label
              htmlFor="reason"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              申請理由 <span className="text-red-500">*</span>
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
              placeholder="有給申請の理由を詳しく記入してください"
              disabled={isLoading}
            />
            {errors.reason && (
              <p className="mt-2 text-sm text-red-600">
                {errors.reason.message}
              </p>
            )}
          </div>

          {/* 注意事項 */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start">
              <span className="text-yellow-500 text-lg mr-3 mt-0.5">⚠️</span>
              <div>
                <h4 className="text-sm font-medium text-yellow-900 mb-2">
                  申請時の注意事項
                </h4>
                <ul className="text-xs text-yellow-800 space-y-1">
                  <li>• 有給申請は最低3営業日前までに申請してください</li>
                  <li>• 長期休暇の場合は事前に上司に相談してください</li>
                  <li>• 申請後は承認されるまで勤務を継続してください</li>
                  <li>• 承認された有給は勤怠記録に自動反映されます</li>
                </ul>
              </div>
            </div>
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
