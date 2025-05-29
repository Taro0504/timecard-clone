# Timecard Clone

タイムカードクローンアプリケーション

## 技術スタック

### フロントエンド
- **Next.js 15.3.2** (App Router)
- **React 19.1.0**
- **TypeScript 5.5.4**
- **TailwindCSS 4.1**
- **shadcn/ui**
- **TanStack Query 5.56.2** (データフェッチング)
- **React Hook Form 7.53.0** (フォーム管理)
- **Zod 3.23.8** (バリデーション)

### バックエンド
- **FastAPI 0.111.0**
- **Python 3.11**
- **SQLAlchemy 2.0** (ORM)
- **PostgreSQL 15** (データベース)
- **Pydantic 2.0** (データバリデーション)
- **Alembic** (データベースマイグレーション)

### 開発ツール
- **pnpm workspace** (モノレポ管理)
- **Turbo** (ビルドシステム)
- **Docker / Docker Compose** (開発環境)
- **ESLint / Prettier** (コード品質)

## プロジェクト構造

```
timecard-clone/
├── frontend/                  # Next.js フロントエンドアプリ
│   ├── src/
│   │   ├── app/              # App Router ページ
│   │   ├── components/       # Reactコンポーネント
│   │   ├── lib/              # ユーティリティ
│   │   └── types/            # TypeScript型定義
│   └── public/               # 静的ファイル
├── backend/                   # FastAPI バックエンドアプリ
│   ├── app/                  # FastAPIアプリケーション
│   └── tests/                # テストファイル
├── docker/                   # Docker設定ファイル
├── docker-compose.yml        # 開発環境構成
└── turbo.json                # Turboビルド設定
```

## セットアップ

### 前提条件
- Node.js 20.18.0+
- Python 3.11+
- pnpm 9.0.0+
- Docker & Docker Compose

### 1. リポジトリのクローンと依存関係のインストール

```bash
git clone <リポジトリURL>
cd timecard-clone

# pnpmを使用して依存関係をインストール
pnpm install
```

### 2. 環境変数の設定

プロジェクトルートに `.env` ファイルを作成してください：

```bash
# データベース設定
DATABASE_URL=postgresql://timecard_user:timecard_password@localhost:5432/timecard_db

# セキュリティ設定
SECRET_KEY=your-secret-key-here

# フロントエンド設定
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 3. Dockerを使用した開発環境の起動

```bash
# 全サービスを起動
docker-compose up -d

# ログを確認
docker-compose logs -f
```

### 4. ローカル開発環境での起動

#### バックエンド（Python仮想環境）
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windowsの場合: venv\\Scripts\\activate
pip install -e .[dev]
uvicorn app.main:app --reload
```

#### フロントエンド
```bash
cd frontend
pnpm dev
```

## 利用可能なコマンド

### ルートディレクトリから
```bash
# 全サービスの開発サーバーを起動
pnpm dev

# 全サービスをビルド
pnpm build

# 全サービスのテストを実行
pnpm test

# 全サービスのリントを実行
pnpm lint

# コードフォーマット
pnpm format
```

### フロントエンドのみ
```bash
cd frontend
pnpm dev          # 開発サーバー起動
pnpm build        # プロダクションビルド
pnpm lint         # ESLintチェック
pnpm type-check   # TypeScriptチェック
```

### バックエンドのみ
```bash
cd backend
pnpm dev          # 開発サーバー起動
pnpm test         # pytest実行
pnpm lint         # ruff + mypy チェック
pnpm format       # black + ruff フォーマット
```

## API仕様

バックエンドサーバー起動後、以下のURLでAPIドキュメントを確認できます：

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## 開発フロー

1. **機能開発**: 小さな単位で機能を実装
2. **型安全性**: TypeScriptの厳密な型チェックを活用
3. **API連携**: OpenAPIスキーマから型を自動生成
4. **テスト**: フロントエンド（Vitest）、バックエンド（pytest）
5. **コード品質**: ESLint、Prettier、Ruff、Blackを使用

## 注意事項

- `.env` ファイルは各自で作成してください（`.env.example` を参考）
- データベースマイグレーションは Alembic を使用
- API型定義は OpenAPI スキーマから自動生成
- pnpm workspace を使用しているため、npm/yarn は使用しないでください 