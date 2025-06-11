'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';

// バリデーションスキーマ
const registerSchema = z
  .object({
    firstName: z
      .string()
      .min(1, '姓は必須です')
      .min(2, '姓は2文字以上で入力してください'),
    lastName: z
      .string()
      .min(1, '名は必須です')
      .min(2, '名は2文字以上で入力してください'),
    email: z
      .string()
      .min(1, 'メールアドレスは必須です')
      .email('正しいメールアドレス形式で入力してください'),
    password: z
      .string()
      .min(1, 'パスワードは必須です')
      .min(8, 'パスワードは8文字以上で入力してください')
      .regex(/[A-Z]/, 'パスワードには大文字を含む必要があります')
      .regex(/[a-z]/, 'パスワードには小文字を含む必要があります')
      .regex(/[0-9]/, 'パスワードには数字を含む必要があります'),
    confirmPassword: z.string().min(1, 'パスワード確認は必須です'),
    termsAccepted: z
      .boolean()
      .refine((val) => val === true, '利用規約に同意してください'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'パスワードが一致しません',
    path: ['confirmPassword'],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    watch,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const password = watch('password');

  // パスワード強度チェック
  const getPasswordStrength = (password: string) => {
    if (!password) return { strength: 0, label: '' };

    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    const labels = ['', '弱い', '普通', '良い', '強い', '非常に強い'];
    const colors = [
      '',
      'text-red-500',
      'text-orange-500',
      'text-yellow-500',
      'text-green-500',
      'text-blue-500',
    ];

    return { strength, label: labels[strength], color: colors[strength] };
  };

  const passwordStrength = getPasswordStrength(password || '');

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);

    try {
      // TODO: 実際の登録処理をここに実装
      console.log('登録試行:', {
        name: `${data.lastName} ${data.firstName}`,
        email: data.email,
        password: data.password,
      });

      // シミュレーション: 2秒後にログインページにリダイレクト
      setTimeout(() => {
        setIsLoading(false);
        console.log('登録成功');
        router.push('/login?registered=true');
      }, 2000);
    } catch (error) {
      setIsLoading(false);
      setError('root', {
        message: '登録に失敗しました。しばらく時間をおいて再度お試しください。',
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* 登録カード */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* ヘッダー */}
          <div className="text-center mb-8">
            <div className="mb-4">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl text-white">🏢</span>
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              新規アカウント作成
            </h1>
            <p className="text-gray-600">FunctionalLabタイムカードシステム</p>
          </div>

          {/* 登録フォーム */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* エラーメッセージ */}
            {errors.root && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex">
                  <span className="text-red-500 mr-2">⚠️</span>
                  <span className="text-red-700 text-sm">
                    {errors.root.message}
                  </span>
                </div>
              </div>
            )}

            {/* 姓名 */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  姓
                </label>
                <input
                  id="lastName"
                  type="text"
                  {...register('lastName')}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    errors.lastName
                      ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                      : 'border-gray-300'
                  }`}
                  placeholder="田中"
                  disabled={isLoading}
                />
                {errors.lastName && (
                  <p className="mt-2 text-sm text-red-600">
                    {errors.lastName.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  名
                </label>
                <input
                  id="firstName"
                  type="text"
                  {...register('firstName')}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    errors.firstName
                      ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                      : 'border-gray-300'
                  }`}
                  placeholder="太郎"
                  disabled={isLoading}
                />
                {errors.firstName && (
                  <p className="mt-2 text-sm text-red-600">
                    {errors.firstName.message}
                  </p>
                )}
              </div>
            </div>

            {/* メールアドレス */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                メールアドレス
              </label>
              <input
                id="email"
                type="email"
                {...register('email')}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.email
                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                    : 'border-gray-300'
                }`}
                placeholder="your@email.com"
                disabled={isLoading}
              />
              {errors.email && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* パスワード */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                パスワード
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  {...register('password')}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors pr-12 ${
                    errors.password
                      ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                      : 'border-gray-300'
                  }`}
                  placeholder="パスワードを入力"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  disabled={isLoading}
                >
                  <span className="text-gray-400 text-sm">
                    {showPassword ? '🙈' : '👁️'}
                  </span>
                </button>
              </div>

              {/* パスワード強度インジケーター */}
              {password && (
                <div className="mt-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">強度:</span>
                    <span
                      className={`text-sm font-medium ${passwordStrength.color}`}
                    >
                      {passwordStrength.label}
                    </span>
                  </div>
                  <div className="mt-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        passwordStrength.strength <= 1
                          ? 'bg-red-500'
                          : passwordStrength.strength <= 2
                            ? 'bg-orange-500'
                            : passwordStrength.strength <= 3
                              ? 'bg-yellow-500'
                              : passwordStrength.strength <= 4
                                ? 'bg-green-500'
                                : 'bg-blue-500'
                      }`}
                      style={{
                        width: `${(passwordStrength.strength / 5) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              )}

              {errors.password && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* パスワード確認 */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                パスワード確認
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  {...register('confirmPassword')}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors pr-12 ${
                    errors.confirmPassword
                      ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                      : 'border-gray-300'
                  }`}
                  placeholder="パスワードを再入力"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  disabled={isLoading}
                >
                  <span className="text-gray-400 text-sm">
                    {showConfirmPassword ? '🙈' : '👁️'}
                  </span>
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* 利用規約同意 */}
            <div>
              <div className="flex items-start">
                <input
                  id="termsAccepted"
                  type="checkbox"
                  {...register('termsAccepted')}
                  className="mt-1 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                  disabled={isLoading}
                />
                <label
                  htmlFor="termsAccepted"
                  className="ml-3 text-sm text-gray-700"
                >
                  <a
                    href="/terms"
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    利用規約
                  </a>
                  および
                  <a
                    href="/privacy"
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    プライバシーポリシー
                  </a>
                  に同意します
                </label>
              </div>
              {errors.termsAccepted && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.termsAccepted.message}
                </p>
              )}
            </div>

            {/* 登録ボタン */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-all duration-200 ${
                isLoading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 shadow-lg hover:shadow-xl'
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  アカウント作成中...
                </div>
              ) : (
                'アカウントを作成'
              )}
            </button>
          </form>

          {/* ログインリンク */}
          <div className="mt-6">
            <div className="text-center">
              <p className="text-sm text-gray-600">
                すでにアカウントをお持ちですか？{' '}
                <a
                  href="/login"
                  className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                >
                  ログイン
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* フッター */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            © 2024 FunctionalLab. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
