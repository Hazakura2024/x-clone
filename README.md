# X-Clone Project

X（旧Twitter）ライクなマイクロブログSNSのバックエンド完全分離型フルスタックアプリケーション。

## 🏗 アーキテクチャと技術スタック

本プロジェクトは **pnpm workspaces** と **Turborepo** を用いたモノレポ構成を採用しています。

### Frontend (`apps/web`)

- **Framework:** Next.js (App Router / React 19)
- **Styling:** Tailwind CSS
- **State Management:** Zustand + URL Search Params
- **Data Fetching:** 標準 `fetch` (SSR) + `next-safe-action` (Mutations)
- **Directory:** `src/` 配下にコンポーネントとルーティングを配置

### Backend (`apps/api`)

- **Framework:** NestJS (CommonJS)
- **ORM:** Prisma
- **Database:** PostgreSQL (Supabase)
- **Design Pattern:** CUIDv2 (主キー), カーソルベースページネーション, 論理削除

### Shared (`packages/shared`)

- **Validation:** Zod
- フロントエンド（フォーム検証）とバックエンド（DTO検証）のスキーマ定義を完全一元化。

### Infrastructure (Supabase)

- **Auth:** Supabase Auth + SQL Trigger (サインアップ時にPrismaのUserテーブルへ自動同期)
- **Storage:** Supabase Storage (Presigned URLによるNext.jsからの直接アップロード)
- **Local Dev:** Supabase CLI (Docker) による完全なローカルエミュレート

---

## 🚀 開発環境のセットアップ

### 1. 依存関係のインストール

プロジェクトルートで以下を実行します。

```bash
pnpm install
pnpm approve-builds # ビルドスクリプトの実行許可
```

### 2. ローカルインフラ (Supabase) の起動

Dockerを立ち上げた状態で実行します。

```bash
npx supabase start
```

※完了するとAPI URLやStudio URL（`http://127.0.0.1:54323`）が出力されます。

### 3. データベースの設定とマイグレーション

`apps/api/.env` にローカルDBの接続情報を設定します。

```env
DATABASE_URL="postgresql://postgres:postgres@127.0.0.1:54322/postgres"
DIRECT_URL="postgresql://postgres:postgres@127.0.0.1:54322/postgres"
```

Prismaのマイグレーションを実行してテーブルを作成します。

```bash
cd apps/api
npx prisma migrate dev --name init_schema
cd ../..
```

### 4. アプリケーションの起動

プロジェクトルートで以下のコマンドを実行し、Next.jsとNestJSを並列起動します。

```bash
pnpm dev
```

- **Next.js:** http://localhost:3000
- **NestJS:** http://localhost:3001
