// components/dashboard/UserInfoClient.tsx
'use client';

import { memo } from 'react';
import { FaSignOutAlt } from 'react-icons/fa';
import type { AuthData } from '@/lib/auth/types';
import { LogoutButton } from './LogoutButton';

interface Props {
  user: AuthData['user'];
}

export const UserInfoClient = memo(({ user }: Props) => (
  <div className="flex items-center px-6 py-4 bg-gray-50 border-t border-gray-200">
    <div className="flex items-center">
      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
        <span className="text-white text-sm font-medium">
          {user?.last_name?.[0] ?? 'U'}
        </span>
      </div>
      <div className="ml-3 flex-1">
        <p className="text-sm font-medium text-gray-700">
          {user?.full_name ?? 'ユーザー'}
        </p>
        <p className="text-xs text-gray-500">
          {user?.role === 'admin' ? '管理者' : '正社員'}
        </p>
      </div>
      <LogoutButton
        title="ログアウト"
        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
      >
        <FaSignOutAlt className="text-sm" />
      </LogoutButton>
    </div>
  </div>
));

UserInfoClient.displayName = 'UserInfoClient';
