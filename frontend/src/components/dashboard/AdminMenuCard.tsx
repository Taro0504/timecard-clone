// components/dashboard/AdminMenuCard.tsx
import Link from 'next/link';
import type { Route } from 'next';
import { iconMap, IconKey } from '@/lib/dashboard/icon';

type Props = { title: string; description: string; href: Route; icon: string };

export const AdminMenuCard = ({ title, description, href, icon }: Props) => {
  const IconComponent = iconMap[icon as IconKey];
  return (
    <Link
      href={href}
      className="bg-white rounded-lg p-4 hover:shadow-md transition-shadow"
    >
      <div className="flex items-center">
        <IconComponent className="text-2xl mr-3 text-green-500" />
        <div>
          <h4 className="font-semibold text-gray-900">{title}</h4>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>
    </Link>
  );
};

AdminMenuCard.displayName = 'AdminMenuCard';
