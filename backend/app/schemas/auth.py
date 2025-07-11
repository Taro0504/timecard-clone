"""認証関連のPydanticスキーマ"""
from pydantic import BaseModel, EmailStr
from typing import Optional
from app.models.user import UserRole


class UserCreate(BaseModel):
    """ユーザー作成スキーマ"""
    email: EmailStr
    password: str
    first_name: str
    last_name: str
    role: UserRole = UserRole.EMPLOYEE
    department: Optional[str] = None
    employee_id: Optional[str] = None


class UserLogin(BaseModel):
    """ユーザーログインスキーマ"""
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    """ユーザー応答スキーマ"""
    id: int
    email: str
    first_name: str
    last_name: str
    role: UserRole
    department: Optional[str] = None
    employee_id: Optional[str] = None
    is_active: bool
    full_name: str

    class Config:
        from_attributes = True


class Token(BaseModel):
    """トークンスキーマ"""
    access_token: str
    token_type: str


class TokenData(BaseModel):
    """トークンデータスキーマ"""
    email: Optional[str] = None
    user_id: Optional[int] = None
    role: Optional[UserRole] = None 