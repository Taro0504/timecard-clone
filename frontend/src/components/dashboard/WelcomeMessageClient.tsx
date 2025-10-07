// components/dashboard/WelcomeMessageClient.tsx
'use client';

import { memo, useEffect, useState } from 'react';
import { formatTime } from '@/lib/utils/time';

type Props = { userName: string };

export const WelcomeMessageClient = memo(({ userName }: Props) => {
  const [now, setNow] = useState<Date>(new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60_000); // 1分ごとに更新
    return () => clearInterval(t);
  }, []);

  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        おはようございます、{userName}さん！
      </h1>
      <p className="text-gray-600">
        今日も1日がんばりましょう。現在の時刻: {formatTime(now)}
      </p>
    </div>
  );
});

WelcomeMessageClient.displayName = 'WelcomeMessageClient';
