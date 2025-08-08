"""認証関連のAPIルーター"""
from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from typing import List
from app.database.database import get_db
from app.models.user import User
from app.schemas.auth import UserCreate, UserLogin, UserResponse, Token
from app.core.security import verify_password, get_password_hash, create_access_token, add_to_blacklist
from app.core.config import settings
from app.dependencies.auth import get_current_admin_user, get_current_active_user, get_token_from_request
from app.services.auth_service import AuthService

router = APIRouter(prefix="/auth", tags=["認証"])


def check_login_restriction(email: str) -> bool:
    """ログイン制限をチェック"""
    if not settings.enable_login_restriction:
        return True
    
    return email in settings.allowed_users


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(user_data: UserCreate, db: Session = Depends(get_db)) -> UserResponse:
    """
    ユーザー登録
    
    Args:
        user_data: ユーザー作成データ
        db: データベースセッション
        
    Returns:
        作成されたユーザー情報
        
    Raises:
        HTTPException: バリデーションエラーまたは重複エラー
    """
    # サービス層でユーザー作成処理を実行
    created_user = await AuthService.create_user(user_data, db)
    
    return created_user


@router.post("/login", response_model=Token)
async def login(user_credentials: UserLogin, db: Session = Depends(get_db)):
    """ユーザーログイン"""
    # ログイン制限チェック
    if not check_login_restriction(user_credentials.email):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="このアカウントでのログインは許可されていません",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # ユーザー検索
    user = db.query(User).filter(User.email == user_credentials.email).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="メールアドレスまたはパスワードが正しくありません",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # パスワード検証
    if not verify_password(user_credentials.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="メールアドレスまたはパスワードが正しくありません",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # アクティブユーザーチェック
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="無効なユーザーです"
        )
    
    # アクセストークン作成
    access_token_expires = timedelta(minutes=settings.access_token_expire_minutes)
    access_token = create_access_token(
        data={
            "sub": user.email,
            "user_id": user.id,
            "role": user.role.value
        },
        expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/login/form", response_model=Token)
async def login_form(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    """フォームベースのログイン（OAuth2互換）"""
    # ログイン制限チェック
    if not check_login_restriction(form_data.username):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="このアカウントでのログインは許可されていません",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # ユーザー検索
    user = db.query(User).filter(User.email == form_data.username).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="メールアドレスまたはパスワードが正しくありません",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # パスワード検証
    if not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="メールアドレスまたはパスワードが正しくありません",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # アクティブユーザーチェック
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="無効なユーザーです"
        )
    
    # アクセストークン作成
    access_token_expires = timedelta(minutes=settings.access_token_expire_minutes)
    access_token = create_access_token(
        data={
            "sub": user.email,
            "user_id": user.id,
            "role": user.role.value
        },
        expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/logout")
async def logout(
    request: Request,
    current_user: User = Depends(get_current_active_user)
):
    """ユーザーログアウト"""
    # リクエストヘッダーからトークンを取得してブラックリストに追加
    token = get_token_from_request(request)
    add_to_blacklist(token)
    
    return {"message": "ログアウトしました"}


@router.post("/logout/token")
async def logout_with_token(token: str):
    """トークンを指定してログアウト"""
    # トークンをブラックリストに追加
    add_to_blacklist(token)
    return {"message": "ログアウトしました"}


@router.get("/logout/status")
async def check_logout_status(
    request: Request,
    current_user: User = Depends(get_current_active_user)
):
    """ログアウト状態をチェック（テスト用）"""
    token = get_token_from_request(request)
    from app.core.security import is_token_blacklisted
    
    is_blacklisted = is_token_blacklisted(token)
    return {
        "user_email": current_user.email,
        "token_blacklisted": is_blacklisted,
        "message": "トークンは無効化されています" if is_blacklisted else "トークンは有効です"
    }


# 管理者向けの許可ユーザー管理API
@router.get("/allowed-users", response_model=list[str])
async def get_allowed_users(current_user: User = Depends(get_current_admin_user)):
    """許可されたユーザーリストを取得（管理者のみ）"""
    return settings.allowed_users


@router.post("/allowed-users")
async def add_allowed_user(
    email: str,
    current_user: User = Depends(get_current_admin_user)
):
    """許可ユーザーリストにユーザーを追加（管理者のみ）"""
    if email not in settings.allowed_users:
        settings.allowed_users.append(email)
        settings.save_allowed_users()
    return {"message": f"ユーザー {email} が許可リストに追加されました"}


@router.delete("/allowed-users/{email}")
async def remove_allowed_user(
    email: str,
    current_user: User = Depends(get_current_admin_user)
):
    """許可ユーザーリストからユーザーを削除（管理者のみ）"""
    if email in settings.allowed_users:
        settings.allowed_users.remove(email)
        settings.save_allowed_users()
        return {"message": f"ユーザー {email} が許可リストから削除されました"}
    else:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="指定されたユーザーは許可リストに存在しません"
        )


@router.put("/login-restriction")
async def toggle_login_restriction(
    enable: bool,
    current_user: User = Depends(get_current_admin_user)
):
    """ログイン制限の有効/無効を切り替え（管理者のみ）"""
    settings.enable_login_restriction = enable
    settings.save_allowed_users()
    status_text = "有効" if enable else "無効"
    return {"message": f"ログイン制限が{status_text}になりました"} 