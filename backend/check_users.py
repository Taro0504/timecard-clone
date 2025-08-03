#!/usr/bin/env python3
"""ユーザー確認スクリプト"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy.orm import Session
from app.database.database import SessionLocal
from app.models.user import User
from app.core.security import verify_password

def check_users():
    """データベースのユーザーを確認"""
    db = SessionLocal()
    
    try:
        # 全ユーザーを取得
        users = db.query(User).all()
        
        print(f"📊 データベース内のユーザー数: {len(users)}")
        print("\n👥 ユーザー一覧:")
        print("=" * 60)
        
        for user in users:
            print(f"ID: {user.id}")
            print(f"メール: {user.email}")
            print(f"名前: {user.first_name} {user.last_name}")
            print(f"役職: {user.role}")
            print(f"部署: {user.department}")
            print(f"社員ID: {user.employee_id}")
            print(f"アクティブ: {user.is_active}")
            print(f"作成日: {user.created_at}")
            print("-" * 40)
        
        # 特定のユーザーでパスワード検証テスト
        print("\n🔐 パスワード検証テスト:")
        print("=" * 40)
        
        test_users = [
            ("admin@example.com", "admin123"),
            ("user@example.com", "user123")
        ]
        
        for email, password in test_users:
            user = db.query(User).filter(User.email == email).first()
            if user:
                is_valid = verify_password(password, user.hashed_password)
                print(f"✅ {email}: パスワード検証 {'成功' if is_valid else '失敗'}")
            else:
                print(f"❌ {email}: ユーザーが見つかりません")
        
    except Exception as e:
        print(f"❌ エラーが発生しました: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    check_users() 