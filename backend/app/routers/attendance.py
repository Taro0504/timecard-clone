"""勤怠管理APIルーター"""
from datetime import date
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query, Request
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.models.user import User
from app.schemas.attendance import (
    AttendanceRecordResponse,
    ClockInRequest,
    ClockOutRequest,
    BreakStartRequest,
    BreakEndRequest,
    AttendanceSummary,
    MonthlyAttendanceSummary
)
from app.services.attendance_service import AttendanceService
from app.dependencies.auth import get_current_active_user

router = APIRouter(prefix="/attendance", tags=["勤怠管理"])


@router.post("/clock-in", response_model=AttendanceRecordResponse)
async def clock_in(
    raw_request: Request,
    request: ClockInRequest,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """出勤記録"""
    import logging
    logger = logging.getLogger(__name__)
    
    # 生のリクエストボディを取得
    body = await raw_request.body()
    logger.info(f"Raw request body: {body}")
    logger.info(f"Raw request body type: {type(body)}")
    
    logger.info(f"Parsed request: {request}")
    logger.info(f"Request type: {type(request)}")
    logger.info(f"Request dict: {request.dict()}")
    
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


@router.post("/cancel-clock-out", response_model=AttendanceRecordResponse)
async def cancel_clock_out(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """退勤キャンセル"""
    try:
        record = AttendanceService.cancel_clock_out(db, current_user)
        return record
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.post("/break/start", response_model=AttendanceRecordResponse)
async def start_break(
    request: BreakStartRequest,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """休憩開始"""
    try:
        record = AttendanceService.start_break(db, current_user, request)
        return record
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.post("/break/end", response_model=AttendanceRecordResponse)
async def end_break(
    request: BreakEndRequest,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """休憩終了"""
    try:
        record = AttendanceService.end_break(db, current_user, request)
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
    record = AttendanceService.get_today_record(db, current_user)
    if not record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="今日の勤怠記録が見つかりません"
        )
    return record


@router.get("/history", response_model=List[AttendanceRecordResponse])
async def get_attendance_history(
    year: Optional[int] = Query(None, description="年"),
    month: Optional[int] = Query(None, description="月"),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """勤怠履歴を取得"""
    if year and month:
        records = AttendanceService.get_monthly_records(db, current_user, year, month)
    else:
        records = AttendanceService.get_recent_records(db, current_user)
    
    return records


@router.get("/summary", response_model=List[AttendanceSummary])
async def get_attendance_summary(
    year: Optional[int] = Query(None, description="年"),
    month: Optional[int] = Query(None, description="月"),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """勤怠サマリーを取得"""
    if year and month:
        summary = AttendanceService.get_monthly_summary(db, current_user, year, month)
    else:
        summary = AttendanceService.get_recent_summary(db, current_user)
    
    return summary


@router.get("/summary/monthly", response_model=MonthlyAttendanceSummary)
async def get_monthly_summary(
    year: int = Query(..., description="年"),
    month: int = Query(..., description="月"),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """月次勤怠サマリーを取得"""
    summary = AttendanceService.get_monthly_summary(db, current_user, year, month)
    return summary


@router.get("/status", response_model=dict)
async def get_attendance_status(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """勤怠状態を取得"""
    status = AttendanceService.get_attendance_status(db, current_user)
    return status 