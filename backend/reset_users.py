#!/usr/bin/env python3
"""ユーザーリセット・再作成スクリプト"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy.orm import Session
from app.database.database import SessionLocal
from app.models.user import User
from app.models.attendance import AttendanceRecord, BreakRecord
from app.core.security import get_password_hash

def reset_and_create_users():
    """既存ユーザーを削除して新しく作成"""
    db = SessionLocal()
    
    try:
        # 関連する勤怠記録と休憩記録を削除
        print("🗑️  関連データを削除中...")
        
        # 休憩記録を削除
        break_records = db.query(BreakRecord).join(AttendanceRecord).filter(
            AttendanceRecord.user_id.in_(
                db.query(User.id).filter(User.email.in_(["admin@example.com", "user@example.com"]))
            )
        ).all()
        
        for record in break_records:
            db.delete(record)
        
        # 勤怠記録を削除
        attendance_records = db.query(AttendanceRecord).join(User).filter(
            User.email.in_(["admin@example.com", "user@example.com"])
        ).all()
        
        for record in attendance_records:
            db.delete(record)
        
        # 既存のユーザーを削除
        existing_users = db.query(User).filter(
            User.email.in_(["admin@example.com", "user@example.com"])
        ).all()
        
        for user in existing_users:
            db.delete(user)
            print(f"🗑️  削除: {user.email}")
        
        db.commit()
        print("✅ 既存ユーザーと関連データを削除しました")
        
        # 管理者ユーザーを作成
        admin = User(
            email="admin@example.com",
            hashed_password=get_password_hash("admin123"),
            first_name="管理者",
            last_name="太郎",
            role="admin",
            department="人事部",
            employee_id="ADM001",
            is_active=True
        )
        db.add(admin)
        print("✅ 管理者ユーザーを作成しました")
        
        # 一般ユーザーを作成
        user = User(
            email="user@example.com",
            hashed_password=get_password_hash("user123"),
            first_name="一般",
            last_name="ユーザー",
            role="employee",
            department="開発部",
            employee_id="EMP001",
            is_active=True
        )
        db.add(user)
        print("✅ 一般ユーザーを作成しました")
        
        db.commit()
        
        print("\n🎉 ユーザーの再作成が完了しました！")
        print("\n📋 ログイン情報:")
        print("=" * 50)
        print("管理者ユーザー:")
        print("  メール: admin@example.com")
        print("  パスワード: admin123")
        print("  役職: admin")
        print("  名前: 管理者 太郎")
        print("  部署: 人事部")
        print()
        print("一般ユーザー:")
        print("  メール: user@example.com")
        print("  パスワード: user123")
        print("  役職: employee")
        print("  名前: 一般 ユーザー")
        print("  部署: 開発部")
        print("=" * 50)

    except Exception as e:
        print(f"❌ エラーが発生しました: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    reset_and_create_users() 