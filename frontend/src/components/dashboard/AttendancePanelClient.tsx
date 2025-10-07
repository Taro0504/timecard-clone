// components/dashboard/attendance/AttendancePanelClient.tsx
'use client';

import { memo } from 'react';
import {
  FaSpinner,
  FaClock,
  FaUserSlash,
  FaPlayCircle,
  FaStopCircle,
} from 'react-icons/fa';
import { useAttendance } from '@/hooks/useAttendance';
import { formatTimeFromString } from '@/lib/utils/time';

export const AttendancePanelClient = memo(() => {
  const {
    todayAttendance,
    isLoading,
    isSubmitting,
    handleClockIn,
    handleClockOut,
  } = useAttendance();
  const isWorking = Boolean(todayAttendance && !todayAttendance.clock_out);

  return (
    <>
      {/* 状態表示 */}
      <div className="mb-6">
        {isLoading ? (
          <div className="flex items-center justify-center h-20">
            <FaSpinner className="animate-spin text-2xl text-blue-600" />
          </div>
        ) : isWorking ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center justify-center">
              <FaClock className="text-green-500 text-2xl mr-3" />
              <div>
                <p className="text-green-700 font-medium">勤務中</p>
                <p className="text-green-600 text-sm">
                  開始時刻: {formatTimeFromString(todayAttendance?.clock_in)}
                </p>
              </div>
            </div>
          </div>
        ) : todayAttendance ? (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-center">
              <FaUserSlash className="text-gray-500 text-2xl mr-3" />
              <div>
                <p className="text-gray-700 font-medium">本日は退勤済み</p>
                <p className="text-gray-600 text-sm">
                  出勤: {formatTimeFromString(todayAttendance.clock_in)} / 退勤:{' '}
                  {formatTimeFromString(todayAttendance.clock_out)}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-center">
              <FaUserSlash className="text-gray-500 text-2xl mr-3" />
              <div>
                <p className="text-gray-700 font-medium">勤務外</p>
                <p className="text-gray-600 text-sm">
                  出勤ボタンを押して勤務を開始してください
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 出退勤ボタン */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-md mx-auto">
        <button
          onClick={handleClockIn}
          disabled={isWorking || isSubmitting || !!todayAttendance}
          className={`py-6 px-8 rounded-xl font-bold text-lg transition-all duration-200 ${
            isWorking || isSubmitting || !!todayAttendance
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl'
          }`}
        >
          {isSubmitting ? (
            <FaSpinner className="block text-2xl mb-2 animate-spin" />
          ) : (
            <FaPlayCircle className="block text-2xl mb-2" />
          )}
          出勤
        </button>

        <button
          onClick={handleClockOut}
          disabled={!isWorking || isSubmitting}
          className={`py-6 px-8 rounded-xl font-bold text-lg transition-all duration-200 ${
            !isWorking || isSubmitting
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-red-600 text-white hover:bg-red-700 shadow-lg hover:shadow-xl'
          }`}
        >
          {isSubmitting ? (
            <FaSpinner className="block text-2xl mb-2 animate-spin" />
          ) : (
            <FaStopCircle className="block text-2xl mb-2" />
          )}
          退勤
        </button>
      </div>
    </>
  );
});

AttendancePanelClient.displayName = 'AttendancePanelClient';
