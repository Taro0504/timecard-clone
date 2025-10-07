// components/dashboard/icons.ts
import {
  FaCheckCircle,
  FaCog,
  FaExclamationTriangle,
  FaCrown,
  FaBullhorn,
  FaMoneyBill,
  FaBriefcase,
  FaCalendarAlt,
  FaClock,
  FaUser,
  FaFileAlt,
} from 'react-icons/fa';

export const iconMap = {
  FaMoneyBill,
  FaBriefcase,
  FaCalendarAlt,
  FaClock,
  FaUser,
  FaFileAlt,
  FaCheckCircle,
  FaCog,
  FaExclamationTriangle,
  FaBullhorn,
  FaCrown,
} as const;

export type IconKey = keyof typeof iconMap;
