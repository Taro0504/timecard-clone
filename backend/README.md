# Backend API

タイムカードクローンアプリのバックエンドAPI

## 技術スタック

- FastAPI 0.111.0+
- Python 3.11+
- SQLAlchemy 2.0 (ORM)
- PostgreSQL (データベース)
- Pydantic 2.0 (データバリデーション)

## セットアップ

```bash
# 仮想環境の作成
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# 依存関係のインストール
pip install -e ".[dev]"

# 開発サーバーの起動
uvicorn app.main:app --reload
```

## API仕様

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc
