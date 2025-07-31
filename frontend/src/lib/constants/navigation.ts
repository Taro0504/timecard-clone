import {
  FaHome,
  FaUser,
  FaClock,
  FaMoneyBill,
  FaBriefcase,
  FaCalendarAlt,
  FaFileAlt,
  FaUsers,
  FaCheckCircle,
  FaCog,
} from 'react-icons/fa';

export interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const navigation: NavigationItem[] = [
  {
    name: 'ダッシュボード',
    href: '/dashboard',
    icon: FaHome,
  },
  {
    name: 'マイページ',
    href: '/dashboard/mypage',
    icon: FaUser,
  },
  {
    name: '勤怠管理',
    href: '/dashboard/attendance',
    icon: FaClock,
  },
  {
    name: '経費申請',
    href: '/dashboard/expenses',
    icon: FaMoneyBill,
  },
  {
    name: 'その他手当',
    href: '/dashboard/allowances',
    icon: FaBriefcase,
  },
  {
    name: '有給申請',
    href: '/dashboard/paid-leave',
    icon: FaCalendarAlt,
  },
  {
    name: '給与明細',
    href: '/dashboard/payslip',
    icon: FaFileAlt,
  },
];

export const adminNavigation: NavigationItem[] = [
  {
    name: '社員管理',
    href: '/dashboard/admin/users',
    icon: FaUsers,
  },
  {
    name: '申請承認',
    href: '/dashboard/admin/approvals',
    icon: FaCheckCircle,
  },
  {
    name: '管理設定',
    href: '/dashboard/admin/settings',
    icon: FaCog,
  },
];
