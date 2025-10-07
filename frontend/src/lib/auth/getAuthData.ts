import 'server-only';
import type { AuthData } from './types';
import { auth0 } from '@/lib/auth0';

// 最低限使用するAuth0ユーザークレームの型
type Auth0User = {
  name?: string;
  family_name?: string;
  [key: string]: unknown;
};

export const getAuthData = async (): Promise<AuthData> => {
  const session = await auth0.getSession();
  const user = session?.user as Auth0User | undefined;
  const isAuthenticated = Boolean(user);
  const mappedUser = isAuthenticated
    ? {
        last_name: user?.family_name,
        full_name: user?.name,
        role: undefined,
      }
    : null;
  return { isAuthenticated, user: mappedUser };
};
