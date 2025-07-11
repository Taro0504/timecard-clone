"""データベース初期化スクリプト"""
from sqlalchemy.orm import Session
from app.database.database import engine, SessionLocal
from app.models.user import User, UserRole
from app.core.security import get_password_hash


def init_db() -> None:
    """データベースを初期化"""
    # テーブル作成
    from app.models import user  # モデルをインポートしてテーブルを作成
    from app.database.database import Base
    
    Base.metadata.create_all(bind=engine)
    
    # 初期データ作成
    db = SessionLocal()
    try:
        # 管理者ユーザーが存在するかチェック
        admin_user = db.query(User).filter(User.email == "admin@example.com").first()
        if not admin_user:
            # 管理者ユーザーを作成
            admin_user = User(
                email="admin@example.com",
                hashed_password=get_password_hash("admin123"),
                first_name="管理者",
                last_name="太郎",
                role=UserRole.ADMIN,
                department="管理部",
                employee_id="ADMIN001",
                is_active=True,
            )
            db.add(admin_user)
            
            # テスト用の一般ユーザーを作成
            test_user = User(
                email="user@example.com",
                hashed_password=get_password_hash("user123"),
                first_name="一般",
                last_name="花子",
                role=UserRole.EMPLOYEE,
                department="営業部",
                employee_id="EMP001",
                is_active=True,
            )
            db.add(test_user)
            
            db.commit()
            print("初期データが作成されました")
        else:
            print("初期データは既に存在します")
            
    except Exception as e:
        print(f"データベース初期化エラー: {e}")
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    init_db() 