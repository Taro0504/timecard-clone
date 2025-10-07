// components/dashboard/QuickAccessCard.tsx
import Link from 'next/link';
import type { Route } from 'next';
import { iconMap, IconKey } from '@/lib/dashboard/icon';

type Props = { title: string; description: string; href: Route; icon: string };

export const QuickAccessCard = ({ title, description, href, icon }: Props) => {
  const IconComponent = iconMap[icon as IconKey];
  return (
    <Link
      href={href}
      className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
    >
      <div className="flex items-center">
        <IconComponent className="text-3xl mr-4" />
        <div>
          <h3 className="text-lg font-bold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>
    </Link>
  );
};

QuickAccessCard.displayName = 'QuickAccessCard';
