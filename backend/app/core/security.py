"""セキュリティ関連のユーティリティ"""
from datetime import datetime, timedelta
from typing import Optional, Set
from jose import JWTError, jwt
from passlib.context import CryptContext
from app.core.config import settings
from app.schemas.auth import TokenData

# パスワードハッシュ化コンテキスト
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# トークンブラックリスト（実際の運用ではRedis等を使用）
token_blacklist: Set[str] = set()


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """パスワードを検証"""
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    """パスワードをハッシュ化"""
    return pwd_context.hash(password)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """アクセストークンを作成"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.access_token_expire_minutes)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.secret_key, algorithm=settings.algorithm)
    return encoded_jwt


def verify_token(token: str) -> Optional[TokenData]:
    """トークンを検証"""
    # ブラックリストチェック
    if token in token_blacklist:
        return None
    
    try:
        payload = jwt.decode(token, settings.secret_key, algorithms=[settings.algorithm])
        email: str = payload.get("sub")
        user_id: int = payload.get("user_id")
        role: str = payload.get("role")
        
        if email is None:
            return None
        
        return TokenData(email=email, user_id=user_id, role=role)
    except JWTError:
        return None


def add_to_blacklist(token: str) -> None:
    """トークンをブラックリストに追加"""
    token_blacklist.add(token)


def is_token_blacklisted(token: str) -> bool:
    """トークンがブラックリストに含まれているかチェック"""
    return token in token_blacklist


def clear_expired_tokens() -> None:
    """期限切れのトークンをブラックリストから削除"""
    # 実際の運用では、トークンの有効期限をチェックして削除
    # 現在の実装では、サーバー再起動時にクリアされる
    pass 