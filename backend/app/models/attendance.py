"""勤怠管理モデル"""
from sqlalchemy import Column, Integer, String, DateTime, Date, Float, ForeignKey, Text, Enum
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database.database import Base
import enum


class AttendanceStatus(str, enum.Enum):
    """勤怠ステータス"""
    PRESENT = "present"  # 出勤
    ABSENT = "absent"  # 欠勤
    LATE = "late"  # 遅刻
    EARLY_LEAVE = "early_leave"  # 早退
    HALF_DAY = "half_day"  # 半休


class BreakStatus(str, enum.Enum):
    """休憩ステータス"""
    WORKING = "working"  # 勤務中
    ON_BREAK = "on_break"  # 休憩中


class AttendanceRecord(Base):
    """勤怠記録テーブル"""
    __tablename__ = "attendance_records"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    date = Column(Date, nullable=False, index=True)
    clock_in = Column(DateTime(timezone=True), nullable=True)
    clock_out = Column(DateTime(timezone=True), nullable=True)
    break_minutes = Column(Integer, default=60)  # 休憩時間（分）
    total_hours = Column(Float, default=0.0)  # 総勤務時間（時間）
    overtime_hours = Column(Float, default=0.0)  # 残業時間（時間）
    status = Column(Enum(AttendanceStatus), default=AttendanceStatus.PRESENT, nullable=False)
    break_status = Column(Enum(BreakStatus), default=BreakStatus.WORKING, nullable=False)  # 休憩ステータス
    notes = Column(Text, nullable=True)  # 備考
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    # リレーション
    user = relationship("User", back_populates="attendance_records")
    break_records = relationship("BreakRecord", back_populates="attendance_record", cascade="all, delete-orphan")

    @property
    def is_clocked_in(self) -> bool:
        """出勤済みかどうか"""
        return self.clock_in is not None

    @property
    def is_clocked_out(self) -> bool:
        """退勤済みかどうか"""
        return self.clock_out is not None

    @property
    def is_working(self) -> bool:
        """勤務中かどうか"""
        return self.is_clocked_in and not self.is_clocked_out

    @property
    def is_on_break(self) -> bool:
        """休憩中かどうか"""
        return self.break_status == BreakStatus.ON_BREAK

    @property
    def total_break_minutes(self) -> int:
        """総休憩時間（分）"""
        return sum(record.duration_minutes for record in self.break_records if record.duration_minutes)


class BreakRecord(Base):
    """休憩記録テーブル"""
    __tablename__ = "break_records"

    id = Column(Integer, primary_key=True, index=True)
    attendance_record_id = Column(Integer, ForeignKey("attendance_records.id"), nullable=False)
    break_start = Column(DateTime(timezone=True), nullable=False)
    break_end = Column(DateTime(timezone=True), nullable=True)
    duration_minutes = Column(Integer, default=0)  # 休憩時間（分）
    notes = Column(Text, nullable=True)  # 備考
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    # リレーション
    attendance_record = relationship("AttendanceRecord", back_populates="break_records")

    @property
    def is_active(self) -> bool:
        """休憩中かどうか"""
        return self.break_end is None 