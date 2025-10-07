'use client';

import { useMemo, useState } from 'react';
import type { AuthData } from '@/lib/auth/types';
import { HeaderClient } from '@/components/dashboard/HeaderClient';
import { SidebarClient } from '@/components/dashboard/SideberClient';

type Props = {
  authData: AuthData;
  children: React.ReactNode;
};

export function DashboardClient({ authData, children }: Props) {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const currentPageName = useMemo(() => 'ダッシュボード', []);

  return (
    <div className="min-h-screen bg-gray-50">
      <HeaderClient
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        currentPageName={currentPageName}
        userName={authData.user?.full_name}
      />

      <div className="flex">
        <SidebarClient
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          user={authData.user}
        />

        <main className="flex-1 p-6 lg:ml-64">{children}</main>
      </div>
    </div>
  );
}
