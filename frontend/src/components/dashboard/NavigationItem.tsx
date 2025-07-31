import { memo } from 'react';
import Link from 'next/link';
import { NavigationItem } from '@/lib/constants/navigation';

interface Props {
  item: NavigationItem;
  isActive: boolean;
  onClick?: () => void;
}

export const NavigationItemComponent = memo(
  ({ item, isActive, onClick }: Props) => (
    <Link
      href={item.href as any}
      onClick={onClick}
      className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
        isActive
          ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600'
          : 'text-gray-700 hover:bg-gray-100'
      }`}
    >
      <item.icon className="mr-3 text-lg" />
      {item.name}
    </Link>
  )
);

NavigationItemComponent.displayName = 'NavigationItem';
