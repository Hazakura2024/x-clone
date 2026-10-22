# システムアーキテクチャ

本プロジェクト「X-Clone」は、大規模なトラフィックや複雑なビジネスロジックに耐えうる**完全バックエンド分離型アーキテクチャ**を採用しています。

UIのレンダリングやBFF（Backend For Frontend）としての役割をNext.jsが担い、データベースの操作や堅牢なビジネスロジックの実行をNestJSが集中的に処理します。

> コーディング規約・命名規則・新機能追加の手順は [05_development.md](./05_development.md) を参照してください。本書は「構造」と「その理由」に絞って記載します。

---

## 目次

1. [システム構成要素](#1-システム構成要素)
2. [外部インフラサービス (Supabase)](#2-外部インフラサービス-supabase)
3. [データフロー (通信パターン)](#3-データフロー-通信パターン)
4. [Frontend 内部構成 (`apps/web`)](#4-frontend-内部構成-appsweb)
5. [状態管理の方針](#5-状態管理の方針)
6. [認証フロー](#6-認証フロー)
7. [メディアアップロードフロー](#7-メディアアップロードフロー)
8. [このアーキテクチャの利点](#8-このアーキテクチャの利点)

---

## 1. システム構成要素

プロジェクトは pnpm workspaces と Turborepo を用いたモノレポ構成として、以下の3つの主要モジュールに分割されています。

```text
x-clone/
├─ apps/
│  ├─ web/        # Next.js (UI / BFF)
│  └─ api/        # NestJS (ビジネスロジック / DB アクセス)
├─ packages/
│  └─ shared/     # Zod スキーマ・共有型
├─ supabase/      # Supabase CLI 設定・マイグレーション
├─ pnpm-workspace.yaml
└─ turbo.json
```

### 1.1. Frontend (`apps/web`)

UIの構築およびクライアントとの接点を担当します。

| 項目 | 内容 |
|---|---|
| フレームワーク | Next.js (App Router / React 19 / `src/` ディレクトリ構成) |
| スタイリング | Tailwind CSS |
| サーバー状態 | 標準 `fetch` による SSR + Next.js Data Cache |
| クライアント状態 | 極小の Zustand + URL Search Params |
| Mutation | Server Actions (`next-safe-action`) |

**役割**

- ユーザーからのリクエストを受け取り、サーバーサイドレンダリング（SSR）を実行する。
- データベースへ直接アクセスせず、すべてバックエンド（NestJS）のAPI経由でデータを取得・更新する。

### 1.2. Backend (`apps/api`)

ビジネスロジックの実行、データベースへの安全なアクセス、および認証の検証を担当します。

| 項目 | 内容 |
|---|---|
| フレームワーク | NestJS (CommonJS) |
| ORM | Prisma |
| 設計パターン | CUIDv2（主キー）/ カーソルベースページネーション / 論理削除 |

**役割**

- Next.js からのAPIリクエストを受け取り、入力値の検証、権限チェック、データベース操作を行う。
- フロントエンドの技術スタック（React/Next.js）の変更に影響されない、独立した堅牢なREST APIサーバーとして機能する。

### 1.3. Shared (`packages/shared`)

フロントエンドとバックエンド間の「型の不整合」を排除するための共有パッケージです。

- **バリデーション**: Zod
- **役割**:
  - APIのリクエスト/レスポンスの型、およびフォームのバリデーションスキーマを定義する。
  - Next.js のフォーム検証（Client / Server Actions）と、NestJS の DTO 検証で**全く同じ Zod スキーマ**を利用する。
  - レスポンス型も `z.infer` で Zod から導出し、型定義を二重管理しない。

---

## 2. 外部インフラサービス (Supabase)

開発時は Docker（Supabase CLI）を用いてローカルにエミュレートし、本番環境と完全な互換性を持たせます。

| サービス | 役割 |
|---|---|
| **Database (PostgreSQL)** | Prisma 経由で NestJS のみが直接接続する。 |
| **Auth (認証)** | Supabase Auth がクライアントへ JWT（アクセストークン）を発行。Next.js と NestJS の両方でこの JWT を検証する。サインアップ時は SQL Trigger で Prisma の User テーブルへ自動同期する。 |
| **Storage (メディア保存)** | 画像・動画は NestJS を経由せず、Presigned URL（署名付きURL）でクライアントから直接アップロードする（帯域幅・メモリの節約）。 |

---

## 3. データフロー (通信パターン)

Next.js と NestJS 間の通信は、読み取り（Query）と書き込み（Mutation）で明確にパターンを分けています。

### 3.1. データの取得 (Query)

Next.js の Server Component から標準の `fetch` API を使用して NestJS にリクエストを送ります。

```text
[Client (Browser)]
   ↓ (URLアクセス)
[Next.js Server Component]
   ↓ (SSR時: fetch `http://localhost:3001/api/...` w/ JWT Auth Header)
[NestJS API]
   ↓ (Prisma)
[PostgreSQL]
```

### 3.2. データの更新 (Mutation)

Client Component で発生したアクションは、一度 Server Actions (`next-safe-action`) で受け止め、セキュアなサーバー環境から NestJS のエンドポイントを呼び出します。

```text
[Client Component (Form)]
   ↓ (Server Actions / @repo/shared による Zod 検証)
[Next.js Server Actions (next-safe-action)]
   ↓ (fetch POST `http://localhost:3001/api/...` w/ JWT Auth Header)
[NestJS API]
   ↓ (@repo/shared による Zod 再検証 / Prisma)
[PostgreSQL]
```

### 3.3. 追加読み込み (カーソルページネーション)

無限スクロールの2ページ目以降は、Client Component から Server Action（または Route Handler）経由で `cursor` を渡して取得します。初回表示は Server Component による SSR です。

```text
[Server Component]  初回20件を SSR
   ↓ initialData
[Client Component (Timeline)]  スクロールで末尾に到達
   ↓ cursor を渡して Server Action 呼び出し
[NestJS API]  次のページを返却（nextCursor 付き）
```

---

## 4. Frontend 内部構成 (`apps/web`)

### 4.1. 設計方針

**「`app/` はルーティング専用、ロジックは `features/` に集約する」** ことを基本方針とします。

- `app/` の `page.tsx` は「データを取得して feature のコンポーネントを並べるだけ」に留める。
- 機能（ドメイン）ごとにコンポーネント・取得処理・更新処理・状態を `features/<name>/` に閉じ込める。
- 機能に依存しない部品は `components/`、インフラ的な基盤は `lib/` に置く。

### 4.2. ディレクトリ構成

```text
apps/web/
├─ src/
│  ├─ app/                         # ルーティングのみ（薄く保つ）
│  │  ├─ (auth)/
│  │  │  ├─ login/page.tsx
│  │  │  ├─ signup/page.tsx
│  │  │  └─ layout.tsx
│  │  ├─ (main)/                   # ログイン後の3カラムレイアウト
│  │  │  ├─ layout.tsx             # サイドバー + 右カラム
│  │  │  ├─ home/page.tsx
│  │  │  ├─ explore/page.tsx       # ?q=...&tab=... は URL Search Params
│  │  │  ├─ notifications/page.tsx
│  │  │  ├─ [username]/
│  │  │  │  ├─ page.tsx            # プロフィール
│  │  │  │  ├─ followers/page.tsx
│  │  │  │  ├─ following/page.tsx
│  │  │  │  └─ status/[postId]/page.tsx   # 投稿詳細
│  │  │  ├─ @modal/                # Parallel Routes
│  │  │  │  ├─ default.tsx
│  │  │  │  ├─ (.)compose/post/page.tsx                  # 投稿モーダル
│  │  │  │  └─ (.)[username]/status/[postId]/page.tsx    # 投稿詳細モーダル
│  │  │  └─ loading.tsx / error.tsx / not-found.tsx
│  │  ├─ api/                      # 必要最小限の Route Handler
│  │  ├─ layout.tsx                # ルート（html/body、Providers）
│  │  ├─ globals.css
│  │  └─ not-found.tsx
│  │
│  ├─ features/                    # 機能（ドメイン）単位。ここが本体
│  │  ├─ post/
│  │  │  ├─ components/            # PostCard, PostComposer, PostActions ...
│  │  │  ├─ actions/               # create-post.ts, delete-post.ts, toggle-like.ts
│  │  │  ├─ queries/               # get-post.ts（server-only の fetch）
│  │  │  ├─ hooks/                 # Client 専用ロジック
│  │  │  ├─ store/                 # composer-store.ts（Zustand）
│  │  │  └─ types.ts               # UI 固有の型のみ
│  │  ├─ timeline/                 # フィード、無限スクロール
│  │  ├─ user/                     # プロフィール表示・編集
│  │  ├─ follow/
│  │  ├─ auth/                     # ログイン/サインアップフォーム、signOut
│  │  ├─ notification/
│  │  ├─ search/
│  │  └─ upload/                   # Presigned URL 取得 → 直接アップロード
│  │
│  ├─ components/                  # 機能に依存しない共通部品
│  │  ├─ ui/                       # Button, Input, Avatar, Modal, Skeleton ...
│  │  ├─ layout/                   # Sidebar, RightColumn, MobileNav
│  │  └─ providers/                # ThemeProvider, ToastProvider
│  │
│  ├─ lib/                         # インフラ・横断的な基盤
│  │  ├─ api/
│  │  │  ├─ client.ts              # NestJS 向け fetch ラッパー（server-only・JWT 付与）
│  │  │  └─ errors.ts
│  │  ├─ supabase/
│  │  │  ├─ server.ts              # Server Components / Actions 用
│  │  │  ├─ browser.ts             # Client 用
│  │  │  └─ proxy.ts               # セッション更新ヘルパー
│  │  ├─ safe-action.ts            # actionClient / authActionClient
│  │  ├─ env.ts                    # 環境変数の Zod 検証
│  │  └─ utils/                    # cn(), formatRelativeTime() など
│  │
│  ├─ hooks/                       # 汎用 hooks（use-debounce など）
│  ├─ config/                      # ルート定数、サイト設定
│  └─ proxy.ts                     # 認証ガード・セッション更新（旧 middleware.ts）
│
├─ public/
├─ e2e/                            # Playwright
├─ next.config.ts
└─ tsconfig.json                   # paths: "@/*" -> "src/*"
```

### 4.3. feature 内ディレクトリの役割

| ディレクトリ | 役割 | 実行場所 |
|---|---|---|
| `queries/` | `import "server-only"` を付けた fetch 関数。`lib/api/client` 経由で NestJS を呼ぶ | Server |
| `actions/` | `"use server"` + `next-safe-action` + `@repo/shared` の Zod スキーマ | Server |
| `components/` | 既定は Server Component。必要な末端のみ `"use client"` | 両方 |
| `store/` | Zustand。**UI のみ**の状態（モーダル開閉、下書き等） | Client |
| `hooks/` | クライアント専用ロジック | Client |
| `types.ts` | UI 固有の型。API の型は `@repo/shared` を使う | 両方 |

### 4.4. `page.tsx` の書き方（例）

```tsx
// app/(main)/home/page.tsx
import { getTimeline } from "@/features/timeline/queries/get-timeline";
import { Timeline } from "@/features/timeline/components/timeline";
import { PostComposer } from "@/features/post/components/post-composer";

export default async function HomePage() {
  const initial = await getTimeline({ limit: 20 });
  return (
    <>
      <PostComposer />
      <Timeline initialData={initial} />
    </>
  );
}
```

### 4.5. Server Action と共有スキーマの連携（例）

```ts
// features/post/actions/create-post.ts
"use server";
import { authActionClient } from "@/lib/safe-action";
import { createPostSchema } from "@repo/shared";
import { revalidatePath } from "next/cache";
import { apiFetch } from "@/lib/api/client";

export const createPostAction = authActionClient
  .inputSchema(createPostSchema)
  .action(async ({ parsedInput }) => {
    const post = await apiFetch("/posts", { method: "POST", body: parsedInput });
    revalidatePath("/home");
    return post;
  });
```

フォーム側でも同じ `createPostSchema` を `react-hook-form` の resolver に渡すことで、フロント・Server Action・NestJS の3箇所で同一ルールの検証が行われます。

### 4.6. ストリーミング

`loading.tsx` と `Suspense` をルート単位・カラム単位で配置し、タイムラインとサイドバーを独立してストリーミングします。

---

## 5. 状態管理の方針

状態は「何の状態か」で置き場所を決めます。

| 種類 | 置き場所 | 例 |
|---|---|---|
| サーバーデータ | SSR の取得結果 + Data Cache | 投稿一覧、プロフィール |
| 共有・再現したい UI 状態 | **URL Search Params** | 検索語、タブ、並び順 |
| 一時的な UI 状態 | **Zustand** | モーダル開閉、投稿の下書き、楽観的 UI の一時状態 |

**サーバーデータは Zustand に入れません。** SSR で取得した結果を正とし、更新後は `revalidatePath` / `revalidateTag` で再取得します。

---

## 6. 認証フロー

```text
[Browser] ── ログイン ──▶ [Supabase Auth] ── JWT 発行 ──▶ [Browser (Cookie)]
                                │
                                └─ SQL Trigger ─▶ [PostgreSQL: User テーブルへ同期]

[Next.js proxy.ts]       Cookie のセッション更新 / 未ログイン時のリダイレクト
[lib/supabase/server.ts] アクセストークン取得
[lib/api/client.ts]      Authorization: Bearer <JWT> を付与して NestJS へ
[NestJS Guard]           JWT を検証し、リクエストユーザーを確定
```

- ルート保護は `proxy.ts` で行うが、**認可の最終判断は必ずサーバー側（`authActionClient` / NestJS Guard）で行う**。
- Server Actions はミドルウェア（`authActionClient`）で認証を一元化する。

---

## 7. メディアアップロードフロー

```text
1. [Client]   アップロード対象を選択
2. [Server Action]  Presigned URL を発行（認証済みユーザーのみ）
3. [Client]   Presigned URL へ fetch(PUT) で Storage に直接アップロード
4. [Client]   完了後、公開 URL を投稿 / プロフィール更新の Action に渡す
5. [NestJS]   URL を保存（Storage 上のパスの妥当性を検証）
```

この処理は `features/upload` に集約し、`post`（投稿画像）や `user`（アバター）から再利用します。

---

## 8. このアーキテクチャの利点

1. **セキュアなデータベースアクセス**: Next.js 側に `DATABASE_URL` などの DB 接続情報を持たせる必要がなくなり、認証・認可の漏れを防ぎやすくなります。
2. **スケーラビリティ**: 「UI の描画負荷（Next.js）」と「複雑なデータ処理負荷（NestJS）」が分離されるため、トラフィックの特性に合わせて個別にスケールさせることが可能です。
3. **DRY 原則の徹底**: `packages/shared` により「フロントエンドの型」と「バックエンドの型」を二重管理する手間がなくなり、開発速度と安全性が向上します。
4. **機能単位の見通しの良さ**: `features/` に責務を閉じ込めることで、機能追加・削除・担当分割がしやすく、`app/` は常に薄い状態を保てます。
5. **Server / Client 境界の明確化**: `queries/`・`actions/`・`store/` の役割が固定されているため、不要な Client バンドルの肥大化を防げます。