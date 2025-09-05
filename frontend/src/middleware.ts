import type { NextRequest } from 'next/server';
import { auth0 } from '@/lib/auth0';

export async function middleware(request: NextRequest) {
  return auth0.middleware(request);
}

export const config = {
  matcher: [
    // すべてのルートを対象にするが、静的ファイルや公開ページは除外
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|login|register).*)',
  ],
};
