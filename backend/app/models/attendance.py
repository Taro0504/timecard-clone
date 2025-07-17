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


class AttendanceRecord(Base):
    """勤怠記録テーブル"""
    __tablename__ = "attendance_records"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    date = Column(Date, nullable=False, index=True)
    clock_in = Column(DateTime(timezone=True), nullable=True)
    clock_out = Column(DateTime(timezone=True), nullable=True)
    total_hours = Column(Float, default=0.0)  # 総勤務時間（時間）
    overtime_hours = Column(Float, default=0.0)  # 残業時間（時間）
    status = Column(Enum(AttendanceStatus), default=AttendanceStatus.PRESENT, nullable=False)
    notes = Column(Text, nullable=True)  # 備考
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    # リレーション
    user = relationship("User", back_populates="attendance_records")

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