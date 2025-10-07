'use client';

import { useState, memo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  FaCheckCircle,
  FaExclamationTriangle,
  FaBuilding,
} from 'react-icons/fa';
import { useLogin } from '@/hooks/useLogin';
import { LoginFormData, loginSchema } from './loginSchema';
import { PasswordField as PasswordFieldComponent } from '../../components/common/formFields/PasswordField';
import { InputField } from '../../components/common/formFields/InputField';

// ヘッダーコンポーネント
const LoginHeader = memo(() => (
  <div className="text-center mb-8">
    <div className="mb-4">
      <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto">
        <FaBuilding className="text-2xl text-white" />
      </div>
    </div>
    <h1 className="text-2xl font-bold text-gray-900 mb-2">FunctionalLab</h1>
    <p className="text-gray-600">タイムカードシステムにログイン</p>
  </div>
));

LoginHeader.displayName = 'LoginHeader';

// 成功メッセージコンポーネント
const SuccessMessage = memo(() => (
  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
    <div className="flex items-center">
      <FaCheckCircle className="text-green-500 mr-2" />
      <span className="text-green-700">
        アカウントが正常に作成されました。ログインしてください。
      </span>
    </div>
  </div>
));

SuccessMessage.displayName = 'SuccessMessage';

// エラーメッセージコンポーネント
const ErrorMessage = memo(({ message }: { message: string }) => (
  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
    <div className="flex items-center">
      <FaExclamationTriangle className="text-red-500 mr-2" />
      <span className="text-red-700">{message}</span>
    </div>
  </div>
));

ErrorMessage.displayName = 'ErrorMessage';

// メールアドレス入力フィールドコンポーネント
const EmailField = memo(
  ({
    register,
    errors,
    isLoading,
  }: {
    register: any;
    errors: any;
    isLoading: boolean;
  }) => (
    <InputField
      id="email"
      label="メールアドレス"
      placeholder="your@email.com"
      register={register('email')}
      error={errors.email}
      disabled={isLoading}
    />
  )
);

EmailField.displayName = 'EmailField';

// パスワード入力フィールドコンポーネント
const PasswordField = memo(
  ({
    register,
    errors,
    isLoading,
  }: {
    register: any;
    errors: any;
    isLoading: boolean;
  }) => (
    <PasswordFieldComponent
      id="password"
      label="パスワード"
      placeholder="パスワードを入力"
      register={register('password')}
      error={errors.password}
      disabled={isLoading}
    />
  )
);

PasswordField.displayName = 'PasswordField';

// ログインボタンコンポーネント
const LoginButton = memo(({ isLoading }: { isLoading: boolean }) => (
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
));

LoginButton.displayName = 'LoginButton';

// フッターリンクコンポーネント
const FooterLinks = memo(() => (
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
));

FooterLinks.displayName = 'FooterLinks';

// フッターコンポーネント
const Footer = memo(() => (
  <div className="text-center mt-8">
    <p className="text-sm text-gray-500">
      © 2024 FunctionalLab. All rights reserved.
    </p>
  </div>
));

Footer.displayName = 'Footer';

export function LoginClient() {
  const { isLoading, showSuccessMessage, errorMessage, handleLogin } =
    useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    await handleLogin(data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* ログインカード */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* ヘッダー */}
          <LoginHeader />

          {/* ログインフォーム */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* 登録成功メッセージ */}
            {showSuccessMessage && <SuccessMessage />}

            {/* エラーメッセージ */}
            {errorMessage && <ErrorMessage message={errorMessage} />}

            {/* メールアドレス */}
            <EmailField
              register={register}
              errors={errors}
              isLoading={isLoading}
            />

            {/* パスワード */}
            <PasswordField
              register={register}
              errors={errors}
              isLoading={isLoading}
            />

            {/* ログインボタン */}
            <LoginButton isLoading={isLoading} />

            {/* Auth0でログイン */}
            <a
              href="/auth/login"
              className="w-full inline-flex justify-center items-center py-3 px-4 rounded-lg font-medium text-white bg-gray-800 hover:bg-black transition-colors"
            >
              Auth0でログイン
            </a>
          </form>

          {/* その他のオプション */}
          <FooterLinks />
        </div>

        {/* フッター */}
        <Footer />
      </div>
    </div>
  );
}
