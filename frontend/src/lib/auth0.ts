import { Auth0Client as BaseAuth0Client } from '@auth0/nextjs-auth0/server';

/**
 * Auth0ユーザー型定義
 */
export interface Auth0User {
  sub: string;
  email?: string;
  name?: string;
  picture?: string;
  [key: string]: unknown;
}

/**
 * Auth0クライアントクラス
 * Auth0の認証機能を統合的に管理
 */
export class Auth0Client {
  private static client = new BaseAuth0Client();

  /**
   * 現在のユーザーセッションを取得
   */
  static async getUser(): Promise<Auth0User | null> {
    try {
      const session = await this.client.getSession();
      return session?.user || null;
    } catch (error) {
      console.error('Failed to get user session:', error);
      return null;
    }
  }

  /**
   * アクセストークンを取得
   */
  static async getAccessToken(): Promise<string | null> {
    try {
      const session = await this.client.getSession();
      if (!session) return null;

      const { token } = await this.client.getAccessToken();
      return token || null;
    } catch (error) {
      console.error('Failed to get access token:', error);
      return null;
    }
  }

  /**
   * ユーザーがログインしているかチェック
   */
  static async isAuthenticated(): Promise<boolean> {
    const user = await this.getUser();
    return !!user;
  }

  /**
   * ユーザー情報を安全に取得（型安全）
   */
  static async getUserInfo(): Promise<{
    id: string;
    email: string;
    name: string;
    picture?: string;
  } | null> {
    const user = await this.getUser();

    if (!user || !user.sub || !user.email) {
      return null;
    }

    return {
      id: user.sub,
      email: user.email,
      name: user.name || user.email,
      picture: user.picture,
    };
  }

  /**
   * ログインページのURL生成
   */
  static getLoginUrl(returnTo?: string): string {
    const params = new URLSearchParams();
    if (returnTo) {
      params.set('returnTo', returnTo);
    }
    return `/api/auth/login${params.toString() ? `?${params.toString()}` : ''}`;
  }

  /**
   * ログアウトページのURL生成
   */
  static getLogoutUrl(returnTo?: string): string {
    const params = new URLSearchParams();
    if (returnTo) {
      params.set('returnTo', returnTo);
    }
    return `/api/auth/logout${params.toString() ? `?${params.toString()}` : ''}`;
  }
}

/**
 * Auth0のセッション状態型定義
 */
export interface Auth0Session {
  user: Auth0User | null;
  isLoading: boolean;
  error: Error | null;
}
