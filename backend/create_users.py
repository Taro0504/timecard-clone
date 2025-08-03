#!/usr/bin/env python3
"""テスト用ユーザー作成スクリプト"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy.orm import Session
from app.database.database import SessionLocal, engine
from app.models.user import User
from app.models.attendance import AttendanceRecord
from app.core.security import get_password_hash
from datetime import date

def create_test_users():
    """テスト用ユーザーを作成"""
    db = SessionLocal()
    
    try:
        # 管理者ユーザー（admin）
        admin_email = "admin@example.com"
        existing_admin = db.query(User).filter(User.email == admin_email).first()
        
        if not existing_admin:
            admin = User(
                email=admin_email,
                hashed_password=get_password_hash("admin123"),
                first_name="管理者",
                last_name="太郎",
                role="admin",
                department="人事部",
                employee_id="ADM001",
                is_active=True
            )
            db.add(admin)
            print(f"✅ 管理者ユーザーを作成しました: {admin_email}")
        else:
            print(f"⚠️  管理者ユーザーは既に存在します: {admin_email}")

        # 一般ユーザー（employee）
        user_email = "user@example.com"
        existing_user = db.query(User).filter(User.email == user_email).first()
        
        if not existing_user:
            user = User(
                email=user_email,
                hashed_password=get_password_hash("user123"),
                first_name="一般",
                last_name="ユーザー",
                role="employee",
                department="開発部",
                employee_id="EMP001",
                is_active=True
            )
            db.add(user)
            print(f"✅ 一般ユーザーを作成しました: {user_email}")
        else:
            print(f"⚠️  一般ユーザーは既に存在します: {user_email}")

        db.commit()
        print("\n🎉 ユーザー作成が完了しました！")
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
        print("\n💡 これらのアカウントでログインしてテストできます。")

    except Exception as e:
        print(f"❌ エラーが発生しました: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    create_test_users() 