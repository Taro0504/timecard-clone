"""勤怠管理のPydanticスキーマ"""
from pydantic import BaseModel
from typing import Optional, List
from datetime import date, datetime
from app.models.attendance import AttendanceStatus, BreakStatus


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
    break_minutes: Optional[int] = None
    total_hours: Optional[float] = None
    overtime_hours: Optional[float] = None
    status: Optional[AttendanceStatus] = None
    notes: Optional[str] = None


class BreakRecordResponse(BaseModel):
    """休憩記録応答スキーマ"""
    id: int
    attendance_record_id: int
    break_start: datetime
    break_end: Optional[datetime] = None
    duration_minutes: int
    notes: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    is_active: bool

    class Config:
        from_attributes = True


class BreakStartRequest(BaseModel):
    """休憩開始リクエストスキーマ"""
    notes: Optional[str] = None


class BreakEndRequest(BaseModel):
    """休憩終了リクエストスキーマ"""
    notes: Optional[str] = None


class AttendanceRecordResponse(AttendanceRecordBase):
    """勤怠記録応答スキーマ"""
    id: int
    user_id: int
    clock_in: Optional[datetime] = None
    clock_out: Optional[datetime] = None
    break_minutes: int
    total_hours: float
    overtime_hours: float
    status: AttendanceStatus
    break_status: BreakStatus
    created_at: datetime
    updated_at: datetime
    is_clocked_in: bool
    is_clocked_out: bool
    is_working: bool
    is_on_break: bool
    total_break_minutes: int
    break_records: List[BreakRecordResponse] = []

    class Config:
        from_attributes = True


class ClockInRequest(BaseModel):
    """出勤リクエストスキーマ"""
    break_minutes: int = 60  # デフォルト1時間
    notes: Optional[str] = None


class ClockOutRequest(BaseModel):
    """退勤リクエストスキーマ"""
    clock_out: str  # ISO形式の日時文字列
    break_minutes: int = 60  # デフォルト1時間
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