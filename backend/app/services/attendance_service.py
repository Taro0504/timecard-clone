"""勤怠管理サービス"""
from datetime import date, datetime, time, timezone
from typing import Optional, List
from sqlalchemy.orm import Session
from app.models.attendance import AttendanceRecord, AttendanceStatus
from app.models.user import User
from app.schemas.attendance import ClockInRequest, ClockOutRequest


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