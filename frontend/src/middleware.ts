import type { NextRequest } from 'next/server';
import { Auth0Client as BaseAuth0Client } from '@auth0/nextjs-auth0/server';

const auth0 = new BaseAuth0Client();

export async function middleware(request: NextRequest) {
  return auth0.middleware(request);
}

export const config = {
  matcher: [
    // すべてのルートを対象にするが、静的ファイルや公開ページは除外
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|login|register).*)',
  ],
};
