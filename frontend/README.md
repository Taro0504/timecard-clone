# フロントエンド - タイムカードクローン

## セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 環境変数の設定

`.env.local` ファイルを作成して以下の内容を追加してください：

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 3. 開発サーバーの起動

```bash
npm run dev
```

## 機能

### 認証機能

- **ログイン**: `/login` - メールアドレスとパスワードでログイン
- **登録**: `/register` - 新規ユーザー登録
- **ログアウト**: ダッシュボードからログアウト可能

### ダッシュボード機能

- **マイページ**: ユーザー情報の表示・編集
- **勤怠管理**: 出勤・退勤の記録
- **経費申請**: 経費の申請・管理
- **手当申請**: 各種手当の申請
- **有給申請**: 有給休暇の申請・管理
- **給与明細**: 給与明細の確認

### 管理者機能（管理者のみ）

- **社員管理**: ユーザーの管理
- **申請承認**: 各種申請の承認
- **管理設定**: システム設定

## 使用方法

### 1. バックエンドの起動

まず、バックエンドサーバーを起動してください：

```bash
cd ../backend
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 2. フロントエンドの起動

```bash
npm run dev
```

### 3. アクセス

- フロントエンド: http://localhost:3000
- バックエンドAPI: http://localhost:8000

### 4. テスト用アカウント

バックエンドの初期データとして以下のアカウントが作成されます：

- **管理者**: `admin@example.com` / `admin123`
- **一般ユーザー**: `user@example.com` / `user123`

## 技術スタック

- **フレームワーク**: Next.js 14 (App Router)
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS
- **フォーム管理**: React Hook Form + Zod
- **アイコン**: React Icons (FontAwesome)
- **状態管理**: React Context API

## ディレクトリ構造

```
src/
├── app/                    # Next.js App Router
│   ├── login/             # ログインページ
│   ├── register/          # 登録ページ
│   └── dashboard/         # ダッシュボード
├── components/            # 再利用可能なコンポーネント
├── contexts/              # React Context
│   └── AuthContext.tsx    # 認証状態管理
├── lib/                   # ユーティリティ
│   └── api.ts            # APIクライアント
└── types/                 # TypeScript型定義
```
