"""勤怠管理サービス"""
from datetime import date, datetime, time, timezone
from typing import Optional, List
from sqlalchemy.orm import Session
from app.models.attendance import AttendanceRecord, AttendanceStatus, BreakRecord, BreakStatus
from app.models.user import User
from app.schemas.attendance import ClockInRequest, ClockOutRequest, BreakStartRequest, BreakEndRequest


class AttendanceService:
    """勤怠管理サービスクラス"""

    # 勤務時間設定（9:00-18:00）
    WORK_START_TIME = time(9, 0)  # 9:00
    WORK_END_TIME = time(18, 0)   # 18:00
    REGULAR_WORK_HOURS = 8.0  # 通常勤務時間（時間）

    @staticmethod
    def get_today_record(db: Session, user_id: int) -> Optional[AttendanceRecord]:
        """今日の勤怠記録を取得"""
        today = date.today()
        return db.query(AttendanceRecord).filter(
            AttendanceRecord.user_id == user_id,
            AttendanceRecord.date == today
        ).first()

    @staticmethod
    def create_today_record(db: Session, user_id: int, break_minutes: int = 60) -> AttendanceRecord:
        """今日の勤怠記録を作成"""
        today = date.today()
        record = AttendanceRecord(
            user_id=user_id,
            date=today,
            break_minutes=break_minutes,
            status=AttendanceStatus.PRESENT
        )
        db.add(record)
        db.commit()
        db.refresh(record)
        return record

    @staticmethod
    def clock_in(db: Session, user: User, request: ClockInRequest) -> AttendanceRecord:
        """出勤処理"""
        today = date.today()
        # UTCタイムゾーンで現在時刻を取得
        current_time = datetime.now(timezone.utc)

        # 今日の記録を取得または作成
        record = AttendanceService.get_today_record(db, user.id)
        if not record:
            record = AttendanceService.create_today_record(db, user.id, request.break_minutes)
        else:
            # 既存の記録の休憩時間を更新
            record.break_minutes = request.break_minutes

        # 既に出勤済みかチェック
        if record.is_clocked_in:
            raise ValueError("既に出勤済みです")

        # 出勤時間を記録
        record.clock_in = current_time
        record.notes = request.notes

        # 遅刻チェック
        if current_time.time() > AttendanceService.WORK_START_TIME:
            record.status = AttendanceStatus.LATE

        db.commit()
        db.refresh(record)
        return record

    @staticmethod
    def clock_out(db: Session, user: User, request: ClockOutRequest) -> AttendanceRecord:
        """退勤処理"""
        # ISO文字列をUTCタイムゾーンのdatetimeに変換
        if request.clock_out.endswith('Z'):
            current_time = datetime.fromisoformat(request.clock_out.replace('Z', '+00:00'))
        else:
            current_time = datetime.fromisoformat(request.clock_out)
        
        # UTCタイムゾーンに統一
        if current_time.tzinfo is None:
            current_time = current_time.replace(tzinfo=timezone.utc)
        else:
            current_time = current_time.astimezone(timezone.utc)

        # 今日の記録を取得
        record = AttendanceService.get_today_record(db, user.id)
        if not record:
            raise ValueError("出勤記録が見つかりません")

        # 既に退勤済みかチェック
        if record.is_clocked_out:
            raise ValueError("既に退勤済みです")

        # 退勤時間を記録
        record.clock_out = current_time
        record.break_minutes = request.break_minutes
        if request.notes:
            record.notes = request.notes

        # 勤務時間を計算
        if record.clock_in:
            # record.clock_inもUTCタイムゾーンに統一
            clock_in_utc = record.clock_in
            if clock_in_utc.tzinfo is None:
                clock_in_utc = clock_in_utc.replace(tzinfo=timezone.utc)
            else:
                clock_in_utc = clock_in_utc.astimezone(timezone.utc)
            
            work_duration = current_time - clock_in_utc
            total_hours = work_duration.total_seconds() / 3600  # 時間に変換

            # 休憩時間を差し引く
            break_hours = record.break_minutes / 60
            if total_hours > break_hours:
                total_hours -= break_hours

            record.total_hours = round(total_hours, 2)

            # 残業時間を計算
            if total_hours > AttendanceService.REGULAR_WORK_HOURS:
                record.overtime_hours = round(total_hours - AttendanceService.REGULAR_WORK_HOURS, 2)

            # 早退チェック
            if current_time.time() < AttendanceService.WORK_END_TIME:
                if record.status == AttendanceStatus.LATE:
                    record.status = AttendanceStatus.HALF_DAY
                else:
                    record.status = AttendanceStatus.EARLY_LEAVE

        db.commit()
        db.refresh(record)
        return record

    @staticmethod
    def cancel_clock_out(db: Session, user: User) -> AttendanceRecord:
        """退勤キャンセル処理"""
        # 今日の記録を取得
        record = AttendanceService.get_today_record(db, user.id)
        if not record:
            raise ValueError("出勤記録が見つかりません")

        # 出勤していない場合
        if not record.is_clocked_in:
            raise ValueError("出勤していないため、退勤キャンセルはできません")

        # 退勤していない場合
        if not record.is_clocked_out:
            raise ValueError("退勤していないため、退勤キャンセルはできません")

        # 退勤時間をクリア
        record.clock_out = None
        record.total_hours = 0.0
        record.overtime_hours = 0.0

        # ステータスを元に戻す
        if record.clock_in:
            current_time = datetime.now(timezone.utc)
            clock_in_utc = record.clock_in
            if clock_in_utc.tzinfo is None:
                clock_in_utc = clock_in_utc.replace(tzinfo=timezone.utc)
            else:
                clock_in_utc = clock_in_utc.astimezone(timezone.utc)
            
            # 遅刻チェック
            if clock_in_utc.time() > AttendanceService.WORK_START_TIME:
                record.status = AttendanceStatus.LATE
            else:
                record.status = AttendanceStatus.PRESENT

        db.commit()
        db.refresh(record)
        return record

    @staticmethod
    def start_break(db: Session, user: User, request: BreakStartRequest) -> AttendanceRecord:
        """休憩開始処理"""
        import logging
        logger = logging.getLogger(__name__)
        
        try:
            # 今日の記録を取得
            record = AttendanceService.get_today_record(db, user.id)
            if not record:
                raise ValueError("出勤記録が見つかりません")

            logger.info(f"Found attendance record: {record.id}")

            # 出勤していない場合
            if not record.is_clocked_in:
                raise ValueError("出勤していないため、休憩を開始できません")

            # 既に退勤済みの場合
            if record.is_clocked_out:
                raise ValueError("退勤済みのため、休憩を開始できません")

            # 既に休憩中の場合
            if record.is_on_break:
                raise ValueError("既に休憩中です")

            logger.info("Starting break...")

            # 休憩記録を作成
            current_time = datetime.now(timezone.utc)
            break_record = BreakRecord(
                attendance_record_id=record.id,
                break_start=current_time,
                notes=request.notes
            )
            db.add(break_record)

            # 勤怠記録のステータスを休憩中に変更
            record.break_status = BreakStatus.ON_BREAK

            db.commit()
            db.refresh(record)
            
            logger.info(f"Break started successfully: {break_record.id}")
            return record
            
        except Exception as e:
            logger.error(f"Error in start_break: {str(e)}")
            db.rollback()
            raise

    @staticmethod
    def end_break(db: Session, user: User, request: BreakEndRequest) -> AttendanceRecord:
        """休憩終了処理"""
        import logging
        logger = logging.getLogger(__name__)
        
        try:
            # 今日の記録を取得
            record = AttendanceService.get_today_record(db, user.id)
            if not record:
                raise ValueError("出勤記録が見つかりません")

            logger.info(f"Found attendance record: {record.id}")

            # 出勤していない場合
            if not record.is_clocked_in:
                raise ValueError("出勤していないため、休憩を終了できません")

            # 既に退勤済みの場合
            if record.is_clocked_out:
                raise ValueError("退勤済みのため、休憩を終了できません")

            # 休憩中でない場合
            if not record.is_on_break:
                raise ValueError("休憩中ではありません")

            logger.info(f"Record is on break: {record.break_status}")

            # アクティブな休憩記録を取得
            active_break = db.query(BreakRecord).filter(
                BreakRecord.attendance_record_id == record.id,
                BreakRecord.break_end.is_(None)
            ).first()

            if not active_break:
                raise ValueError("アクティブな休憩記録が見つかりません")

            logger.info(f"Found active break record: {active_break.id}")

            # 休憩終了時間を記録
            current_time = datetime.now(timezone.utc)
            active_break.break_end = current_time

            # 休憩時間を計算（タイムゾーンを統一）
            break_start_utc = active_break.break_start
            if break_start_utc.tzinfo is None:
                break_start_utc = break_start_utc.replace(tzinfo=timezone.utc)
            else:
                break_start_utc = break_start_utc.astimezone(timezone.utc)
            
            break_duration = current_time - break_start_utc
            active_break.duration_minutes = int(break_duration.total_seconds() / 60)

            logger.info(f"Break duration calculated: {active_break.duration_minutes} minutes")

            if request.notes:
                active_break.notes = request.notes

            # 勤怠記録のステータスを勤務中に戻す
            record.break_status = BreakStatus.WORKING

            db.commit()
            db.refresh(record)
            
            logger.info("Break ended successfully")
            return record
            
        except Exception as e:
            logger.error(f"Error in end_break: {str(e)}")
            db.rollback()
            raise

    @staticmethod
    def get_user_records(db: Session, user_id: int, start_date: date, end_date: date) -> List[AttendanceRecord]:
        """ユーザーの勤怠記録を取得"""
        return db.query(AttendanceRecord).filter(
            AttendanceRecord.user_id == user_id,
            AttendanceRecord.date >= start_date,
            AttendanceRecord.date <= end_date
        ).order_by(AttendanceRecord.date.desc()).all()

    @staticmethod
    def get_monthly_summary(db: Session, user_id: int, year: int, month: int) -> dict:
        """月次勤怠集計を取得"""
        from datetime import datetime
        import calendar

        # 月の最初と最後の日を取得
        first_day = date(year, month, 1)
        last_day = date(year, month, calendar.monthrange(year, month)[1])

        # 月の勤怠記録を取得
        records = AttendanceService.get_user_records(db, user_id, first_day, last_day)

        # 集計計算
        total_work_days = len([r for r in records if r.is_clocked_in])
        total_work_hours = sum(r.total_hours for r in records if r.total_hours)
        total_overtime_hours = sum(r.overtime_hours for r in records if r.overtime_hours)
        average_daily_hours = total_work_hours / total_work_days if total_work_days > 0 else 0

        return {
            "year": year,
            "month": month,
            "total_work_days": total_work_days,
            "total_work_hours": round(total_work_hours, 2),
            "total_overtime_hours": round(total_overtime_hours, 2),
            "average_daily_hours": round(average_daily_hours, 2),
            "records": records
        } 