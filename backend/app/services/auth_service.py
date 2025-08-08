"""認証関連のビジネスロジック"""
from typing import Optional
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.user import User
from app.schemas.auth import UserCreate
from app.core.security import get_password_hash
from app.core.config import settings


class AuthService:
    """認証サービス"""
    
    @staticmethod
    async def create_user(user_data: UserCreate, db: Session) -> User:
        """
        ユーザーを作成する
        
        Args:
            user_data: ユーザー作成データ
            db: データベースセッション
            
        Returns:
            作成されたユーザー
            
        Raises:
            HTTPException: バリデーションエラーまたは重複エラー
        """
        # メールアドレスの重複チェック
        existing_user = db.query(User).filter(User.email == user_data.email).first()
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="このメールアドレスは既に使用されています"
            )
        
        # パスワードの長さチェック
        if len(user_data.password) < settings.min_password_length:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"パスワードは{settings.min_password_length}文字以上である必要があります"
            )
        
        # パスワードの強度チェック
        if not AuthService._validate_password_strength(user_data.password):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="パスワードは英数字を含む必要があります"
            )
        
        # ユーザー作成
        hashed_password = get_password_hash(user_data.password)
        db_user = User(
            email=user_data.email,
            hashed_password=hashed_password,
            first_name=user_data.first_name,
            last_name=user_data.last_name,
            role=user_data.role,
            department=user_data.department,
            employee_id=user_data.employee_id,
        )
        
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        
        return db_user
    
    @staticmethod
    def _validate_password_strength(password: str) -> bool:
        """
        パスワードの強度を検証する
        
        Args:
            password: 検証するパスワード
            
        Returns:
            強度が十分な場合はTrue
        """
        # 英数字を含むかチェック
        has_alpha = any(c.isalpha() for c in password)
        has_digit = any(c.isdigit() for c in password)
        
        return has_alpha and has_digit 