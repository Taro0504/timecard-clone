"""アプリケーション設定"""
from pydantic_settings import BaseSettings
import json
import os


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
    
    # ログイン制限設定
    enable_login_restriction: bool = True  # ログイン制限を有効にするか
    allowed_users: list[str] = [
        "admin@example.com",
        "user@example.com",
        # 追加の許可ユーザーをここに記述
    ]
    
    class Config:
        env_file = ".env"
        case_sensitive = False
    
    def save_allowed_users(self):
        """許可ユーザーリストをファイルに保存"""
        config_file = "login_restriction_config.json"
        config_data = {
            "enable_login_restriction": self.enable_login_restriction,
            "allowed_users": self.allowed_users
        }
        with open(config_file, "w", encoding="utf-8") as f:
            json.dump(config_data, f, ensure_ascii=False, indent=2)
    
    def load_allowed_users(self):
        """許可ユーザーリストをファイルから読み込み"""
        config_file = "login_restriction_config.json"
        if os.path.exists(config_file):
            try:
                with open(config_file, "r", encoding="utf-8") as f:
                    config_data = json.load(f)
                    self.enable_login_restriction = config_data.get("enable_login_restriction", True)
                    self.allowed_users = config_data.get("allowed_users", self.allowed_users)
            except Exception as e:
                print(f"設定ファイルの読み込みエラー: {e}")


# 設定インスタンス
settings = Settings()
# 起動時に設定を読み込み
settings.load_allowed_users() 