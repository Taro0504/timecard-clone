"""勤怠管理APIルーター"""
from datetime import date
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.models.user import User
from app.schemas.attendance import (
    AttendanceRecordResponse,
    ClockInRequest,
    ClockOutRequest,
    AttendanceSummary,
    MonthlyAttendanceSummary
)
from app.services.attendance_service import AttendanceService
from app.auth.dependencies import get_current_active_user

router = APIRouter(prefix="/attendance", tags=["勤怠管理"])


@router.post("/clock-in", response_model=AttendanceRecordResponse)
async def clock_in(
    request: ClockInRequest,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """出勤記録"""
    try:
        record = AttendanceService.clock_in(db, current_user, request)
        return record
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.post("/clock-out", response_model=AttendanceRecordResponse)
async def clock_out(
    request: ClockOutRequest,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """退勤記録"""
    try:
        record = AttendanceService.clock_out(db, current_user, request)
        return record
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.get("/today", response_model=AttendanceRecordResponse)
async def get_today_record(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """今日の勤怠記録を取得"""
    record = AttendanceService.get_today_record(db, current_user.id)
    if not record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="今日の勤怠記録が見つかりません"
        )
    return record


@router.get("/records", response_model=List[AttendanceRecordResponse])
async def get_attendance_records(
    start_date: date = Query(..., description="開始日"),
    end_date: date = Query(..., description="終了日"),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """勤怠記録一覧を取得"""
    records = AttendanceService.get_user_records(db, current_user.id, start_date, end_date)
    return records


@router.get("/summary/monthly", response_model=MonthlyAttendanceSummary)
async def get_monthly_summary(
    year: int = Query(..., description="年"),
    month: int = Query(..., description="月"),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """月次勤怠集計を取得"""
    summary = AttendanceService.get_monthly_summary(db, current_user.id, year, month)
    return summary


@router.get("/status", response_model=dict)
async def get_attendance_status(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """現在の勤怠状況を取得"""
    record = AttendanceService.get_today_record(db, current_user.id)
    
    if not record:
        return {
            "is_working": False,
            "is_clocked_in": False,
            "is_clocked_out": False,
            "message": "今日はまだ出勤していません"
        }
    
    return {
        "is_working": record.is_working,
        "is_clocked_in": record.is_clocked_in,
        "is_clocked_out": record.is_clocked_out,
        "clock_in_time": record.clock_in,
        "clock_out_time": record.clock_out,
        "total_hours": record.total_hours,
        "overtime_hours": record.overtime_hours,
        "status": record.status,
        "message": "勤務中" if record.is_working else "退勤済み" if record.is_clocked_out else "出勤済み"
    } 