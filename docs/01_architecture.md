# システムアーキテクチャ

本プロジェクト「X-Clone」は、大規模なトラフィックや複雑なビジネスロジックに耐えうる**完全バックエンド分離型アーキテクチャ**を採用しています。

UIのレンダリングやBFF（Backend For Frontend）としての役割をNext.jsが担い、データベースの操作や堅牢なビジネスロジックの実行をNestJSが集中的に処理します。

---

## 1. システム構成要素

プロジェクトは pnpm workspaces と Turborepo を用いたモノレポ構成として、以下の3つの主要モジュールに分割されています。

### 1.1. Frontend (`apps/web`)
UIの構築およびクライアントとの接点を担当します。
- **フレームワーク**: Next.js (App Router / `src/` ディレクトリ構成)
- **スタイリング**: Tailwind CSS
- **状態管理**: 
  - サーバー状態: Next.js App Router のキャッシュメカニズム（Data Cache）
  - クライアント状態: 極小の Zustand と URL Search Params の併用
- **役割**: 
  - ユーザーからのリクエストを受け取り、サーバーサイドレンダリング（SSR）を実行。
  - データベースへ直接アクセスすることはせず、すべてバックエンド（NestJS）のAPIを経由してデータを取得・更新する。

### 1.2. Backend (`apps/api`)
ビジネスロジックの実行、データベースへの安全なアクセス、および認証の検証を担当します。
- **フレームワーク**: NestJS (CommonJS)
- **ORM**: Prisma
- **役割**: 
  - Next.js からのAPIリクエストを受け取り、入力値の検証、権限チェック、データベース操作を行う。
  - フロントエンドの技術スタック（React/Next.js）の変更に影響されない、独立した堅牢なREST APIサーバーとして機能する。

### 1.3. Shared (`packages/shared`)
フロントエンドとバックエンド間の「単一障害点（型の不整合）」を排除するための共有パッケージです。
- **バリデーション**: Zod
- **役割**: 
  - APIのリクエスト/レスポンスの型、およびフォームのバリデーションスキーマを定義。
  - Next.js のフォーム検証（Client/Server Actions）と、NestJS の DTO（Data Transfer Object）検証で全く同じ Zod スキーマを利用する。

---

## 2. 外部インフラサービス (Supabase)

開発時は Docker（Supabase CLI）を用いてローカルにエミュレートし、本番環境と完全な互換性を持たせます。

- **Database (PostgreSQL)**: Prisma 経由で NestJS のみが直接接続する。
- **Auth (認証)**: Supabase Auth を利用し、クライアントへ JWT（アクセストークン）を発行。Next.js と NestJS の両方でこの JWT を検証し、セキュアな通信を担保する。
- **Storage (メディア保存)**: 画像や動画のアップロードは、NestJS を経由させず、Presigned URL（署名付きURL）を発行してクライアントから直接アップロードする（帯域幅・メモリの節約）。

---

## 3. データフロー (通信パターン)

Next.js と NestJS 間の通信は、読み取り（Query）と書き込み（Mutation）で明確にパターンを分けています。

### 3.1. データの取得 (Query)
Next.js の Server Component から標準の `fetch` API を使用して NestJS にリクエストを送ります。

```text
[Client (Browser)] 
   ↓ (URLアクセス)
[Next.js Server Component] 
   ↓ (SSR時: fetch `http://localhost:3001/api/...`)
[NestJS API] 
   ↓ (Prisma)
[PostgreSQL]
```

### 3.2. データの更新 (Mutation)
Client Component で発生したアクションは、一度 Server Actions (`next-safe-action`) で受け止め、セキュアなサーバー環境から NestJS のエンドポイントを呼び出します。

```text
[Client Component (Form)] 
   ↓ (Server Actions / @repo/shared によるZod検証)
[Next.js Server Actions (next-safe-action)] 
   ↓ (fetch POST `http://localhost:3001/api/...` w/ JWT Auth Header)
[NestJS API] 
   ↓ (@repo/shared によるZod再検証 / Prisma)
[PostgreSQL]
```

---

## 4. このアーキテクチャの利点

1. **セキュアなデータベースアクセス**: Next.js 側に `DATABASE_URL` などのDB接続情報を持たせる必要がなくなり、認証・認可の漏れを防ぎやすくなります。
2. **スケーラビリティ**: 「UIの描画負荷（Next.js）」と「複雑なデータ処理負荷（NestJS）」が分離されるため、トラフィックの特性に合わせて個別にサーバーをスケール（拡張）させることが可能です。
3. **DRY原則の徹底**: `packages/shared` により「フロントエンドの型」と「バックエンドの型」を二重管理する手間がなくなり、開発速度と安全性が向上します。