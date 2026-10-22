# 開発ワークフロー

本プロジェクト「X-Clone」では、フロントエンド・バックエンド・共有パッケージを一元管理するため、**pnpm workspaces** と **Turborepo** を活用したモノレポ構成を採用しています。

> システム全体の構造と設計意図は [01_architecture.md](./01_architecture.md) を参照してください。本書は「開発者が守るルールと手順」をまとめます。

---

## 目次

1. [モノレポ管理ツール群](#1-モノレポ管理ツール群)
2. [主要コマンド一覧](#2-主要コマンド一覧)
3. [新規コードの追加フロー](#3-新規コードの追加フロー)
4. [フロントエンド コーディング規約 (`apps/web`)](#4-フロントエンド-コーディング規約-appsweb)
5. [バックエンド コーディング規約 (`apps/api`)](#5-バックエンド-コーディング規約-appsapi)
6. [テスト方針](#6-テスト方針)
7. [Git 運用](#7-git-運用)

---

## 1. モノレポ管理ツール群

### パッケージマネージャー: `pnpm`

node_modules の肥大化を防ぐ「ハードリンク」の仕組みにより、ディスク容量を節約しつつ高速なインストールを実現します。ワークスペース機能（`pnpm-workspace.yaml`）により、`apps/` や `packages/` 内の各プロジェクトを1つのリポジトリ内で連携させています。

### タスクランナー: `Turborepo` (turbo)

Next.js を提供する Vercel 社製のビルドシステムです。

- **並列実行**: Next.js と NestJS のローカルサーバー起動などを安全に並列実行します。
- **キャッシュ**: 過去に実行したビルドやテストの結果をハッシュ化して記憶し、ソースコードに変更がないパッケージの再実行をスキップ（キャッシュヒット）します。

---

## 2. 主要コマンド一覧

プロジェクトのルートディレクトリで実行します。

### サーバー起動

```bash
# Next.js (web) と NestJS (api) の両方を開発モードで同時に起動
pnpm dev
```

### パッケージのインストール

特定のアプリにだけ追加する場合は `--filter` を使用します。

```bash
# Next.js (web) にのみライブラリを追加
pnpm --filter web add [パッケージ名]

# NestJS (api) にのみ開発用ライブラリを追加
pnpm --filter api add -D [パッケージ名]

# 全パッケージの依存関係をインストール / 同期
pnpm install
```

### ビルド・静的解析・テスト

```bash
# 依存関係を考慮した順序（shared -> api / web）で全体をビルド
pnpm build

# 全プロジェクトの Lint チェック
pnpm lint

# 全プロジェクトの型チェック
pnpm typecheck

# 全プロジェクトのテスト
pnpm test
```

> `typecheck` / `test` が `turbo.json` と各 `package.json` に未定義の場合は、先にスクリプトを追加してください。

### データベース (Prisma) 操作

NestJS（`apps/api`）内の Prisma 操作コマンドです。

```bash
# schema.prisma を変更した後、マイグレーションを作成・適用
pnpm --filter api exec prisma migrate dev --name [変更内容の名前]

# Prisma Client の型を再生成（schema 変更後や pull 後に実行）
pnpm --filter api exec prisma generate
```

### Supabase (ローカル環境)

```bash
# ローカルの Supabase 一式（DB / Auth / Storage / Studio）を Docker で起動
npx supabase start

# 停止
npx supabase stop

# 起動中の接続情報（API URL, anon key, Studio URL など）を表示
npx supabase status
```

---

## 3. 新規コードの追加フロー

機能を追加するときは、**データ → 共有スキーマ → API → UI** の順に進めます。

1. **DB 設計の変更**: `apps/api/prisma/schema.prisma` を編集し、マイグレーションを実行する。
2. **バリデーションの定義**: `packages/shared/src/schemas/` に Zod スキーマを作成し、`index.ts` から export する。レスポンス型は `z.infer` で導出する。
3. **バックエンド実装**: `apps/api/src/` にコントローラーとサービスを作成する。Zod スキーマから DTO を生成して検証する。
4. **フロントエンド実装**: `apps/web/src/features/<name>/` に実装する（詳細は次項）。

### 3.1. フロントエンドで新しい feature を追加する手順

1. `features/<name>/` を作成し、必要なサブディレクトリだけを用意する（空のディレクトリは作らない）。
2. `queries/` に `import "server-only"` を付けた取得関数を作成する（`lib/api/client` 経由）。
3. `actions/` に `"use server"` の Server Action を作成する。`authActionClient` と `@repo/shared` のスキーマを使う。
4. `components/` に UI を作成する。既定は Server Component とし、必要な末端のみ `"use client"` を付ける。
5. `app/` に `page.tsx` を追加し、feature のコンポーネントを並べる。`page.tsx` にロジックを書かない。
6. 更新系の Action では、影響する画面の `revalidatePath` / `revalidateTag` を忘れずに呼ぶ。
7. `loading.tsx` / `error.tsx` が必要なルートには併せて追加する。

---

## 4. フロントエンド コーディング規約 (`apps/web`)

### 4.1. 配置ルール

| 置くもの | 場所 |
|---|---|
| ルーティング、`page.tsx` / `layout.tsx` など | `src/app/` |
| 機能固有のコンポーネント・取得・更新・状態 | `src/features/<name>/` |
| 機能に依存しない共通 UI | `src/components/` |
| API クライアント、Supabase、環境変数などの基盤 | `src/lib/` |
| 汎用 hooks | `src/hooks/` |

### 4.2. Server / Client の境界

- コンポーネントは**既定で Server Component**。`"use client"` は状態・イベント・ブラウザ API が必要な**末端のコンポーネントだけ**に付ける。
- `queries/` のファイルには必ず `import "server-only"` を付ける。
- `actions/` のファイルには必ず `"use server"` を付ける。
- `lib/api/client.ts` はサーバー専用。Client Component から直接 import しない。
- JWT・サーバー専用の環境変数を Client に渡さない。ブラウザに公開してよい値のみ `NEXT_PUBLIC_` を付ける。

### 4.3. import ルール

- **feature をまたぐ import は公開されたコンポーネントのみ**とする。他 feature の `store/` や `hooks/`、`actions/` の内部実装には触れない。
- 依存方向は `app` → `features` → `components` / `lib` / `hooks` の一方向。`components` や `lib` から `features` を import しない。
- feature 同士の循環依存を作らない。共通化が必要になったら `components/` か `lib/` に移す。
- **barrel（`index.ts`）の再エクスポートは原則使わない。** Server / Client の境界が曖昧になり、バンドルも膨らみやすい。
- パスエイリアス `@/*`（`src/*`）を使い、`../../..` のような深い相対パスは避ける。
- 上記は ESLint（`import/no-restricted-paths` または `eslint-plugin-boundaries`）で機械的に強制する。

### 4.4. 状態管理

- 検索語・タブ・並び順など、共有や「戻る」操作で再現したい状態は **URL Search Params** に持たせる。
- **サーバーデータを Zustand に入れない。** SSR の取得結果を正とする。
- Zustand は「モーダル開閉・投稿の下書き・楽観的 UI の一時状態」に限定し、store は feature ごとに分ける。

### 4.5. フォームと Server Action

- フォームのバリデーションと Server Action の入力検証には、**同じ `@repo/shared` のスキーマ**を使う。フロント専用のスキーマを重複定義しない。
- Server Action は `next-safe-action` の `authActionClient` を使い、認証をミドルウェアで一元化する。
- Action の戻り値はシリアライズ可能な値のみ。エラーは `next-safe-action` の仕組みで返し、例外を握りつぶさない。

### 4.6. 命名・ファイル規約

| 対象 | 規約 | 例 |
|---|---|---|
| ファイル / ディレクトリ | kebab-case | `post-card.tsx`, `get-timeline.ts` |
| コンポーネント名 | PascalCase | `PostCard` |
| hooks | `use` + camelCase | `usePostComposer` |
| Server Action | `〜Action` | `createPostAction` |
| Zustand store | `use〜Store` | `useComposerStore` |
| 型 | PascalCase、Zod 由来は `z.infer` | `type Post = z.infer<typeof postSchema>` |

- **1ファイル1コンポーネント**を基本とする。
- ファイルが **200行を超えたら分割**を検討する（目安）。
- 型は API の型を `@repo/shared` から使う。`features/*/types.ts` には UI 固有の型だけを書く。
- `any` は使わない。やむを得ない場合は理由をコメントで残す。

### 4.7. パフォーマンス・UX

- 画面の独立した領域（タイムライン、サイドバーなど）は `Suspense` と `loading.tsx` で個別にストリーミングする。
- 画像は `next/image` を使い、投稿メディアには `width` / `height` を指定してレイアウトシフトを防ぐ。
- 無限スクロールの追加読み込みは、カーソルベースで取得し、重複 ID を除外して結合する。

---

## 5. バックエンド コーディング規約 (`apps/api`)

- Controller は入力検証と委譲のみ。ビジネスロジックは Service に書く。
- 入力は `@repo/shared` の Zod スキーマで検証する（フロントの検証を信用しない）。
- DB 操作は Service（または Repository）に閉じ込め、Controller から Prisma を直接呼ばない。
- 主キーは CUIDv2、削除は論理削除（`deletedAt`）を基本とし、一覧取得では削除済みを除外する。
- 一覧 API はカーソルベースページネーションで統一し、`nextCursor` を返す。
- 認可は Guard で認証を確認し、リソースごとの権限（本人のみ編集可など）は Service で検証する。
- Supabase のユーザー同期は SQL Trigger が担うため、アプリ側で User 作成処理を重複実装しない。

---

## 6. テスト方針

| 種類 | 対象 | ツール | 配置 |
|---|---|---|---|
| Unit | ユーティリティ、Zod スキーマ、Service のロジック | Vitest / Jest | 対象ファイルの隣（`post-card.test.tsx`） |
| Component | 重要な Client Component | Testing Library | 対象ファイルの隣 |
| E2E | ログイン、投稿、フォローなど主要導線 | Playwright | `apps/web/e2e/` |

- `packages/shared` のスキーマは、境界値（文字数上限など）のテストを必ず書く。
- バグ修正時は、再現するテストを先に追加する。

---

## 7. Git 運用

- ブランチ名: `feature/<内容>` / `fix/<内容>` / `chore/<内容>`
- コミットメッセージは Conventional Commits を推奨する（例: `feat(post): 投稿の削除を追加`）。
- PR 提出前に `pnpm lint` / `pnpm typecheck` / `pnpm test` / `pnpm build` が通ることを確認する。
- `schema.prisma` を変更した PR には、マイグレーションファイルを必ず含める。
- `.env` はコミットしない。必要な変数は `.env.example` に追記する。