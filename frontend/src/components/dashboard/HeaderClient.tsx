// components/dashboard/HeaderClient.tsx
'use client';

import { memo } from 'react';
import { FaBars, FaBell, FaSignOutAlt } from 'react-icons/fa';
import { LogoutButton } from './LogoutButton';

interface Props {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  currentPageName: string;
  userName?: string;
}

export const HeaderClient = memo(
  ({ isSidebarOpen, setIsSidebarOpen, currentPageName, userName }: Props) => (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 lg:hidden"
          >
            <FaBars className="text-xl" />
          </button>
          <h1 className="ml-2 text-lg font-semibold text-gray-900 lg:ml-0">
            {currentPageName}
          </h1>
        </div>

        <div className="flex items-center space-x-4">
          {userName && (
            <span className="hidden sm:inline text-sm text-gray-700">
              {userName}
            </span>
          )}
          <button
            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100"
            title="通知"
          >
            <FaBell className="text-lg" />
          </button>
          <LogoutButton className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors flex items-center">
            <FaSignOutAlt className="mr-2" />
            ログアウト
          </LogoutButton>
        </div>
      </div>
    </header>
  )
);

HeaderClient.displayName = 'HeaderClient';
