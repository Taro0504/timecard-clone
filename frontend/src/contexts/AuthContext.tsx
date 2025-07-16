'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { useRouter } from 'next/navigation';
import { apiClient, LoginRequest, UserResponse } from '@/lib/api';

interface AuthContextType {
  user: UserResponse | null;
  token: string | null;
  isLoading: boolean;
  login: (data: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // 初期化時にトークンを確認
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('auth_token');
      if (storedToken) {
        try {
          setToken(storedToken);
          const userData = await apiClient.getCurrentUser(storedToken);
          setUser(userData);
        } catch (error) {
          console.error('トークン検証エラー:', error);
          // トークンが無効な場合は削除
          localStorage.removeItem('auth_token');
          setToken(null);
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (data: LoginRequest) => {
    try {
      const response = await apiClient.login(data);
      const { access_token } = response;

      // トークンを保存
      localStorage.setItem('auth_token', access_token);
      setToken(access_token);

      // ユーザー情報を取得
      const userData = await apiClient.getCurrentUser(access_token);
      setUser(userData);

      // ダッシュボードにリダイレクト
      router.push('/dashboard');
    } catch (error) {
      console.error('ログインエラー:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      if (token) {
        // バックエンドにログアウト通知
        await apiClient.logout(token);
      }
    } catch (error) {
      console.error('ログアウトエラー:', error);
    } finally {
      // ローカルストレージをクリア
      localStorage.removeItem('auth_token');
      setToken(null);
      setUser(null);

      // ログインページにリダイレクト
      router.push('/login');
    }
  };

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    login,
    logout,
    isAuthenticated: !!user && !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
