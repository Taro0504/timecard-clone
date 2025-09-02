import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Auth0Provider } from './Auth0Provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Timecard Clone',
  description: 'タイムカードクローンアプリケーション',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <Auth0Provider>{children}</Auth0Provider>
      </body>
    </html>
  );
}
