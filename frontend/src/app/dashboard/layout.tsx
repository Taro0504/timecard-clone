import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { DashboardClient } from './DashboardClient';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { getAuthData } from '@/lib/auth/getAuthData';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const authData = await getAuthData();

  if (!authData.isAuthenticated) {
    redirect('/login');
  }

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <DashboardClient authData={authData}>{children}</DashboardClient>
    </Suspense>
  );
}
