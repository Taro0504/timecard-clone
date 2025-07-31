import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient, AttendanceRecord } from '@/lib/api';

export const useAttendance = () => {
  const { token } = useAuth();
  const [todayAttendance, setTodayAttendance] =
    useState<AttendanceRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchTodayAttendance = async () => {
      if (!token) return;

      try {
        setIsLoading(true);
        const today = await apiClient.getTodayAttendance(token);
        setTodayAttendance(today);
      } catch (error) {
        console.error('今日の勤怠データ取得エラー:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTodayAttendance();
  }, [token]);

  const handleClockIn = async () => {
    if (!token) return;

    try {
      setIsSubmitting(true);
      const newAttendance = await apiClient.clockIn(token, {
        break_minutes: 60, // デフォルト1時間
      });
      setTodayAttendance(newAttendance);
    } catch (error) {
      console.error('出勤エラー:', error);
      throw new Error('出勤の記録に失敗しました。');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClockOut = async () => {
    if (!token || !todayAttendance) return;

    try {
      setIsSubmitting(true);
      const updatedAttendance = await apiClient.clockOut(token, {
        clock_out: new Date().toISOString(),
        break_minutes: todayAttendance.break_minutes,
      });
      setTodayAttendance(updatedAttendance);
    } catch (error) {
      console.error('退勤エラー:', error);
      throw new Error('退勤の記録に失敗しました。');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    todayAttendance,
    isLoading,
    isSubmitting,
    handleClockIn,
    handleClockOut,
  };
};
