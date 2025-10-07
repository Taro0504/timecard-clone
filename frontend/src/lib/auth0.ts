import { Auth0Client } from '@auth0/nextjs-auth0/server';

// v4 推奨: 単一インスタンスをエクスポート
export const auth0 = new Auth0Client({
  signInReturnToPath: '/dashboard',
  authorizationParameters: {
    audience: process.env.AUTH0_AUDIENCE,
    scope: process.env.AUTH0_SCOPE,
  },
});
