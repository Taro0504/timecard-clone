'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { FaExclamationTriangle, FaBuilding } from 'react-icons/fa';
import { apiClient } from '@/lib/api';
import { RegisterFormData, registerSchema } from './registerSchema';
import { InputField } from './InputField';
import { PasswordField } from './PasswordField';

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const password = watch('password');

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      // バックエンドAPIに登録リクエスト
      await apiClient.register({
        email: data.email,
        password: data.password,
        first_name: data.firstName,
        last_name: data.lastName,
        role: 'employee', // デフォルトは一般ユーザー
      });

      // 登録成功後、ログインページにリダイレクト
      router.push('/login?registered=true');
    } catch (error) {
      setIsLoading(false);
      console.error('登録エラー:', error);

      // エラーメッセージを設定
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage(
          '登録に失敗しました。しばらく時間をおいて再度お試しください。'
        );
      }
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
                <FaBuilding className="text-2xl text-white" />
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
            {errorMessage && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center">
                  <FaExclamationTriangle className="text-red-500 mr-2" />
                  <span className="text-red-700">{errorMessage}</span>
                </div>
              </div>
            )}

            {/* 姓名 */}
            <div className="grid grid-cols-2 gap-4">
              <InputField
                id="lastName"
                label="姓"
                placeholder="田中"
                register={register('lastName')}
                error={errors.lastName}
                disabled={isLoading}
              />
              <InputField
                id="firstName"
                label="名"
                placeholder="太郎"
                register={register('firstName')}
                error={errors.firstName}
                disabled={isLoading}
              />
            </div>

            {/* メールアドレス */}
            <InputField
              id="email"
              label="メールアドレス"
              type="email"
              placeholder="your@email.com"
              register={register('email')}
              error={errors.email}
              disabled={isLoading}
            />

            {/* パスワード */}
            <PasswordField
              id="password"
              label="パスワード"
              placeholder="パスワードを入力"
              register={register('password')}
              error={errors.password}
              disabled={isLoading}
              showStrengthBar={true}
              passwordValue={password}
            />

            {/* パスワード確認 */}
            <PasswordField
              id="confirmPassword"
              label="パスワード確認"
              placeholder="パスワードを再入力"
              register={register('confirmPassword')}
              error={errors.confirmPassword}
              disabled={isLoading}
            />

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
