'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// バリデーションスキーマ
const expenseSchema = z.object({
  expenseName: z.string().min(1, '経費の名称は必須です'),
  purpose: z.string().min(1, '用途を選択してください'),
  amount: z
    .number({ invalid_type_error: '金額を数字で入力してください' })
    .min(1, '金額は1円以上で入力してください'),
  evidence: z
    .any()
    .refine(
      (files) => files?.length > 0,
      '証拠となるファイルをアップロードしてください'
    )
    .refine(
      (files) => files?.[0]?.size <= 5000000,
      `ファイルサイズは5MBまでです`
    )
    .refine(
      (files) =>
        ['image/jpeg', 'image/png', 'application/pdf'].includes(
          files?.[0]?.type
        ),
      '対応ファイルはJPEG, PNG, PDFのみです'
    ),
});

type ExpenseFormData = z.infer<typeof expenseSchema>;

const PURPOSE_OPTIONS = [
  '交通費',
  '備品・消耗品費',
  '接待交際費',
  '出張費',
  'その他',
];

export default function ExpensePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [fileName, setFileName] = useState('');
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<ExpenseFormData>({
    resolver: zodResolver(expenseSchema),
  });

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFileName(e.target.files[0].name);
    } else {
      setFileName('');
    }
  };

  const onSubmit = async (data: ExpenseFormData) => {
    setIsLoading(true);
    try {
      // TODO: 実際の申請処理をここに実装
      console.log('経費申請:', {
        ...data,
        evidence: data.evidence[0],
      });

      // シミュレーション: 2秒後に履歴ページにリダイレクト
      setTimeout(() => {
        setIsLoading(false);
        console.log('申請成功');
        router.push('/dashboard/expenses/history');
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
          <h1 className="text-2xl font-bold text-gray-900 mb-2">経費申請</h1>
          <p className="text-gray-600">業務で発生した経費を申請します。</p>
        </div>
        <Link
          href="/dashboard/expenses/history"
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

          {/* 経費名称 */}
          <div>
            <label
              htmlFor="expenseName"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              経費の名称 <span className="text-red-500">*</span>
            </label>
            <input
              id="expenseName"
              type="text"
              {...register('expenseName')}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 ${
                errors.expenseName
                  ? 'border-red-300 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-blue-500'
              }`}
              placeholder="例：〇〇社への移動交通費"
              disabled={isLoading}
            />
            {errors.expenseName && (
              <p className="mt-2 text-sm text-red-600">
                {errors.expenseName.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 用途 */}
            <div>
              <label
                htmlFor="purpose"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                用途 <span className="text-red-500">*</span>
              </label>
              <select
                id="purpose"
                {...register('purpose')}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 ${
                  errors.purpose
                    ? 'border-red-300 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
                disabled={isLoading}
              >
                <option value="">選択してください</option>
                {PURPOSE_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
              {errors.purpose && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.purpose.message}
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
                placeholder="例：3000"
                disabled={isLoading}
              />
              {errors.amount && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.amount.message}
                </p>
              )}
            </div>
          </div>

          {/* 証拠ファイル */}
          <div>
            <label
              htmlFor="evidence"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              証拠ファイル (領収書など) <span className="text-red-500">*</span>
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                  aria-hidden="true"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="evidence"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
                  >
                    <span>ファイルをアップロード</span>
                    <input
                      id="evidence"
                      type="file"
                      className="sr-only"
                      {...register('evidence')}
                      onChange={onFileChange}
                      accept="image/png, image/jpeg, application/pdf"
                      disabled={isLoading}
                    />
                  </label>
                  <p className="pl-1">またはドラッグ＆ドロップ</p>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG, PDF (5MBまで)</p>
                {fileName && (
                  <p className="text-sm text-green-600 mt-2">{fileName}</p>
                )}
              </div>
            </div>
            {errors.evidence && (
              <p className="mt-2 text-sm text-red-600">
                {errors.evidence.message as string}
              </p>
            )}
          </div>

          {/* ボタン */}
          <div className="flex justify-end pt-4 border-t border-gray-200">
            <button
              type="submit"
              disabled={isLoading}
              className={`px-8 py-3 rounded-lg font-medium text-white transition-all duration-200 flex items-center justify-center ${
                isLoading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl'
              }`}
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  申請中...
                </>
              ) : (
                'この内容で申請する'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
