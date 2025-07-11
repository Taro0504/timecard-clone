"""アプリケーション設定"""
from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    """アプリケーション設定クラス"""
    # アプリケーション基本設定
    app_name: str = "Timecard Clone API"
    app_version: str = "0.1.0"
    
    # セキュリティ設定
    secret_key: str = "your-secret-key-here-change-in-production"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    
    # データベース設定
    database_url: str = "sqlite:///./timecard_clone.db"
    
    # CORS設定
    allowed_origins: list[str] = ["http://localhost:3000"]
    
    # パスワード設定
    min_password_length: int = 8
    
    class Config:
        env_file = ".env"
        case_sensitive = False


# 設定インスタンス
settings = Settings() 