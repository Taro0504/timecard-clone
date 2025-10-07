// components/dashboard/NewsItem.tsx
import { iconMap, IconKey } from '@/lib/dashboard/icon';

type Props = {
  title: string;
  date: string;
  type: 'info' | 'success' | 'warning';
  icon: string;
};

export const NewsItem = ({ title, date, type, icon }: Props) => {
  const IconComponent = iconMap[icon as IconKey];

  const bgColorClass =
    type === 'info'
      ? 'bg-blue-50'
      : type === 'success'
        ? 'bg-green-50'
        : 'bg-yellow-50';

  const textColorClass =
    type === 'info'
      ? 'text-blue-500'
      : type === 'success'
        ? 'text-green-500'
        : 'text-yellow-500';

  const titleColorClass =
    type === 'info'
      ? 'text-blue-900'
      : type === 'success'
        ? 'text-green-900'
        : 'text-yellow-900';

  const dateColorClass =
    type === 'info'
      ? 'text-blue-700'
      : type === 'success'
        ? 'text-green-700'
        : 'text-yellow-700';

  return (
    <div className={`flex items-start p-3 ${bgColorClass} rounded-lg`}>
      <IconComponent className={`${textColorClass} mr-3 mt-0.5 text-lg`} />
      <div>
        <p className={`text-sm font-medium ${titleColorClass}`}>{title}</p>
        <p className={`text-xs ${dateColorClass} mt-1`}>{date}</p>
      </div>
    </div>
  );
};

NewsItem.displayName = 'NewsItem';
