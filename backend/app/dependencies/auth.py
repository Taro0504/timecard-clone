"""認証の依存関係"""
from fastapi import Depends, HTTPException, status, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.models.user import User, UserRole
from app.core.security import verify_token
from app.schemas.auth import TokenData
from app.core.config import settings
from jose import jwt
from jose.exceptions import JWTError
import urllib.request
import json

# HTTP Bearer認証スキーム
security = HTTPBearer()


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
) -> User:
    """現在のユーザーを取得"""
    token_data = verify_token(credentials.credentials)
    if token_data is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="認証に失敗しました",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    user = db.query(User).filter(User.email == token_data.email).first()
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="ユーザーが見つかりません",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    return user


def get_auth0_claims(
    credentials: HTTPAuthorizationCredentials = Depends(security),
):
    """Auth0のJWTを検証し、クレームを返す（ユーザーマッピングは行わない）"""
    token = credentials.credentials

    if not settings.auth0_domain:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Auth0設定が未設定です")

    issuer = settings.auth0_issuer or f"https://{settings.auth0_domain}/"

    try:
        # JWKsを取得
        jwks_url = f"{issuer}.well-known/jwks.json"
        with urllib.request.urlopen(jwks_url) as response:
            jwks = json.load(response)

        headers = jwt.get_unverified_header(token)
        kid = headers.get("kid")
        key = next((k for k in jwks.get("keys", []) if k.get("kid") == kid), None)
        if key is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="JWTキーが見つかりません")

        # x5c から PEM 証明書を生成して検証
        x5c_chain = key.get("x5c")
        if not x5c_chain or not isinstance(x5c_chain, list):
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="JWKにx5cがありません")
        cert_str = "-----BEGIN CERTIFICATE-----\n" + x5c_chain[0] + "\n-----END CERTIFICATE-----\n"

        payload = jwt.decode(
            token,
            cert_str,
            algorithms=settings.auth0_algorithms,
            audience=settings.auth0_audience,
            issuer=issuer,
        )

        return {
            "sub": payload.get("sub"),
            "email": payload.get("email"),
            "name": payload.get("name"),
            "picture": payload.get("picture"),
            "claims": payload,
        }
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="無効なトークンです",
            headers={"WWW-Authenticate": "Bearer"},
        )


def get_current_active_user(current_user: User = Depends(get_current_user)) -> User:
    """現在のアクティブユーザーを取得"""
    if not current_user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="無効なユーザーです"
        )
    return current_user


def get_current_admin_user(current_user: User = Depends(get_current_active_user)) -> User:
    """現在の管理者ユーザーを取得"""
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="管理者権限が必要です"
        )
    return current_user


def get_token_from_request(request: Request) -> str:
    """リクエストヘッダーからトークンを取得"""
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="認証トークンが必要です",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return auth_header.split(" ")[1] 