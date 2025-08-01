import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const { login, isAuthenticated } = useAuth();

  // 既にログインしている場合はダッシュボードにリダイレクト
  useEffect(() => {
    if (isAuthenticated) {
      window.location.href = '/dashboard';
    }
  }, [isAuthenticated]);

  // 登録成功メッセージの表示
  useEffect(() => {
    const registered = searchParams.get('registered');
    if (registered === 'true') {
      setShowSuccessMessage(true);
      // 5秒後にメッセージを非表示
      setTimeout(() => setShowSuccessMessage(false), 5000);
    }
  }, [searchParams]);

  const handleLogin = async (data: { email: string; password: string }) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      await login(data);
      // ログイン成功時はAuthContextでリダイレクトが処理される
    } catch (error) {
      setIsLoading(false);
      console.error('ログインエラー:', error);

      // エラーメッセージを設定
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage(
          'ログインに失敗しました。メールアドレスとパスワードを確認してください。'
        );
      }
    }
  };

  return {
    isLoading,
    showSuccessMessage,
    errorMessage,
    handleLogin,
  };
};
