"""勤怠管理のPydanticスキーマ"""
from pydantic import BaseModel
from typing import Optional
from datetime import date, datetime
from app.models.attendance import AttendanceStatus


class AttendanceRecordBase(BaseModel):
    """勤怠記録の基本スキーマ"""
    date: date
    notes: Optional[str] = None


class AttendanceRecordCreate(AttendanceRecordBase):
    """勤怠記録作成スキーマ"""
    pass


class AttendanceRecordUpdate(BaseModel):
    """勤怠記録更新スキーマ"""
    clock_in: Optional[datetime] = None
    clock_out: Optional[datetime] = None
    total_hours: Optional[float] = None
    overtime_hours: Optional[float] = None
    status: Optional[AttendanceStatus] = None
    notes: Optional[str] = None


class AttendanceRecordResponse(AttendanceRecordBase):
    """勤怠記録応答スキーマ"""
    id: int
    user_id: int
    clock_in: Optional[datetime] = None
    clock_out: Optional[datetime] = None
    total_hours: float
    overtime_hours: float
    status: AttendanceStatus
    created_at: datetime
    updated_at: datetime
    is_clocked_in: bool
    is_clocked_out: bool
    is_working: bool

    class Config:
        from_attributes = True


class ClockInRequest(BaseModel):
    """出勤リクエストスキーマ"""
    notes: Optional[str] = None


class ClockOutRequest(BaseModel):
    """退勤リクエストスキーマ"""
    notes: Optional[str] = None


class AttendanceSummary(BaseModel):
    """勤怠集計スキーマ"""
    date: date
    total_hours: float
    overtime_hours: float
    status: AttendanceStatus
    clock_in: Optional[datetime] = None
    clock_out: Optional[datetime] = None


class MonthlyAttendanceSummary(BaseModel):
    """月次勤怠集計スキーマ"""
    year: int
    month: int
    total_work_days: int
    total_work_hours: float
    total_overtime_hours: float
    average_daily_hours: float
    attendance_records: list[AttendanceSummary] 