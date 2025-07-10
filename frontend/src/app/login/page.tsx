'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter, useSearchParams } from 'next/navigation';
import { FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';

// バリデーションスキーマ
const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'メールアドレスは必須です')
    .email('正しいメールアドレス形式で入力してください'),
  password: z
    .string()
    .min(1, 'パスワードは必須です')
    .min(6, 'パスワードは6文字以上で入力してください'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  // 登録成功メッセージの表示
  useEffect(() => {
    const registered = searchParams.get('registered');
    if (registered === 'true') {
      setShowSuccessMessage(true);
      // 5秒後にメッセージを非表示
      setTimeout(() => setShowSuccessMessage(false), 5000);
    }
  }, [searchParams]);

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);

    try {
      // TODO: 実際のログイン処理をここに実装
      console.log('ログイン試行:', data);

      // シミュレーション: 2秒後にダッシュボードにリダイレクト
      setTimeout(() => {
        setIsLoading(false);
        console.log('ログイン成功');
        router.push('/');
      }, 2000);
    } catch (error) {
      setIsLoading(false);
      setError('root', {
        message:
          'ログインに失敗しました。メールアドレスとパスワードを確認してください。',
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* ログインカード */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* ヘッダー */}
          <div className="text-center mb-8">
            <div className="mb-4">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl text-white">🏢</span>
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              FunctionalLab
            </h1>
            <p className="text-gray-600">タイムカードシステムにログイン</p>
          </div>

          {/* ログインフォーム */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* 登録成功メッセージ */}
            {showSuccessMessage && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center">
                  <FaCheckCircle className="text-green-500 mr-2" />
                  <span className="text-green-700">ログインに成功しました</span>
                </div>
              </div>
            )}

            {/* エラーメッセージ */}
            {errors.root && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center">
                  <FaExclamationTriangle className="text-red-500 mr-2" />
                  <span className="text-red-700">ログインに失敗しました</span>
                </div>
              </div>
            )}

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
              {errors.password && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* ログインボタン */}
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
                  ログイン中...
                </div>
              ) : (
                'ログイン'
              )}
            </button>
          </form>

          {/* その他のオプション */}
          <div className="mt-6 space-y-4">
            {/* パスワードを忘れた場合 */}
            <div className="text-center">
              <a
                href="/forgot-password"
                className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
              >
                パスワードを忘れた場合
              </a>
            </div>

            {/* 区切り線 */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">または</span>
              </div>
            </div>

            {/* 新規登録リンク */}
            <div className="text-center">
              <p className="text-sm text-gray-600">
                アカウントをお持ちでないですか？{' '}
                <a
                  href="/register"
                  className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                >
                  新規登録
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
