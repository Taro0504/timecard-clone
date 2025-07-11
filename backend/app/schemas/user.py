"""ユーザープロフィール関連のPydanticスキーマ"""
from pydantic import BaseModel
from typing import Optional
from datetime import date


class UserProfile(BaseModel):
    """ユーザープロフィールスキーマ"""
    id: int
    email: str
    first_name: str
    last_name: str
    department: Optional[str] = None
    employee_id: Optional[str] = None
    birth_date: Optional[date] = None
    gender: Optional[str] = None
    join_date: Optional[date] = None
    address: Optional[str] = None
    emergency_contacts: Optional[list] = None
    bank_account: Optional[dict] = None
    social_insurance: Optional[dict] = None
    full_name: str

    class Config:
        from_attributes = True


class UserProfileUpdate(BaseModel):
    """ユーザープロフィール更新スキーマ"""
    birth_date: Optional[date] = None
    gender: Optional[str] = None
    join_date: Optional[date] = None
    address: Optional[str] = None
    emergency_contacts: Optional[list] = None
    bank_account: Optional[dict] = None
    social_insurance: Optional[dict] = None 