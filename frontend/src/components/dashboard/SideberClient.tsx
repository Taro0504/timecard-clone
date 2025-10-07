// components/dashboard/SidebarClient.tsx
'use client';

import { memo } from 'react';
import { usePathname } from 'next/navigation';
import { FaBuilding } from 'react-icons/fa';
import { navigation, adminNavigation } from '@/lib/constants/navigation';
import { NavigationItemComponent } from '@/components/dashboard/NavigationItem';
import { UserInfoClient } from './UserInfoClient';
import type { AuthData } from '@/lib/auth/types';

interface Props {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  user: AuthData['user'];
}

export const SidebarClient = memo(
  ({ isSidebarOpen, setIsSidebarOpen, user }: Props) => {
    const pathname = usePathname() || '';

    const isActive = (href: string) => {
      if (!href) return false;
      if (href === '/dashboard') return pathname === href;
      return pathname.startsWith(href);
    };

    return (
      <>
        {isSidebarOpen && (
          <div
            className="fixed inset-0 z-40 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          >
            <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
          </div>
        )}

        <div
          className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:transform-none lg:relative lg:z-auto lg:flex lg:flex-col lg:min-h-screen ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex flex-col h-full">
            <div className="flex items-center px-6 py-4 bg-blue-600">
              <div className="flex items-center">
                <FaBuilding className="text-2xl text-white mr-3" />
                <h1 className="text-xl font-bold text-white">FunctionalLab</h1>
              </div>
            </div>

            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
              {navigation.map((item) => (
                <NavigationItemComponent
                  key={item.name}
                  item={item}
                  isActive={isActive(item.href)}
                  onClick={() => setIsSidebarOpen(false)}
                />
              ))}

              {user?.role === 'admin' && (
                <div className="pt-4 mt-4 border-t border-gray-200">
                  <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    管理者メニュー
                  </p>
                  <div className="mt-2 space-y-1">
                    {adminNavigation.map((item) => (
                      <NavigationItemComponent
                        key={item.name}
                        item={item}
                        isActive={isActive(item.href)}
                        onClick={() => setIsSidebarOpen(false)}
                      />
                    ))}
                  </div>
                </div>
              )}
            </nav>

            <UserInfoClient user={user} />
          </div>
        </div>
      </>
    );
  }
);

SidebarClient.displayName = 'SidebarClient';
