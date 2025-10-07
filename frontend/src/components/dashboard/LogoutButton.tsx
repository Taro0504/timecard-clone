// components/dashboard/LogoutButton.tsx
'use client';

import { PropsWithChildren } from 'react';

interface Props extends PropsWithChildren {
  className?: string;
  title?: string;
}

export const LogoutButton = ({ className, title, children }: Props) => {
  const onLogout = async () => {
    try {
      // await fetch('/api/logout', { method: 'POST' }); // 必要に応じて
    } finally {
      window.location.href =
        '/auth/logout?returnTo=http://localhost:3000/login';
    }
  };

  return (
    <button onClick={onLogout} className={className} title={title}>
      {children}
    </button>
  );
};
