'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api';
import { getAccessToken } from '@auth0/nextjs-auth0';

type Auth0Me = { user: unknown };

export function useAuth0Profile() {
  const [data, setData] = useState<Auth0Me | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let active = true;
    const run = async () => {
      try {
        const accessToken = await getAccessToken();
        const me = await apiClient.getAuth0Me(accessToken);
        if (!active) return;
        setData(me);
      } catch (e: unknown) {
        if (!active) return;
        setError(e instanceof Error ? e.message : 'Unknown error');
      } finally {
        if (active) setLoading(false);
      }
    };
    run();
    return () => {
      active = false;
    };
  }, []);

  return { data, error, loading };
}
