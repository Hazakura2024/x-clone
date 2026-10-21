# 開発ワークフロー

本プロジェクト「X-Clone」では、大規模なフロントエンド・バックエンドのコードベースを一元管理するため、**pnpm workspaces** と **Turborepo** を活用したモノレポ構成を採用しています。

---

## 1. モノレポ管理ツール群

### パッケージマネージャー: `pnpm`
Node_modulesの肥大化を防ぐ「ハードリンク」の仕組みにより、ディスク容量を節約しつつ高速なインストールを実現します。
ワークスペース機能（`pnpm-workspace.yaml`）により、`apps/` や `packages/` 内の各プロジェクトを1つのリポジトリ内で連携させています。

### タスクランナー: `Turborepo` (turbo)
Next.jsを提供するVercel社製のビルドシステムです。
- **並列実行**: Next.js と NestJS のローカルサーバー起動などを安全に並列実行します。
- **キャッシュ**: 過去に実行したビルドやテストの結果をハッシュ化して記憶し、ソースコードに変更がないパッケージの再ビルドをスキップ（キャッシュヒット）することで、開発スピードを劇的に向上させます。

---

## 2. 主要コマンド一覧

プロジェクトのルートディレクトリ（`~/project/x-clone`）で実行する主要なコマンドです。

### サーバー起動
```bash
# Next.js (web) と NestJS (api) の両方を開発モードで同時に立ち上げます
pnpm dev
```

### パッケージのインストール
モノレポ環境では、特定のアプリにだけパッケージをインストールするために `--filter` オプションを使用します。

```bash
# 例: Next.js (web) にのみライブラリを追加する
pnpm --filter web add [パッケージ名]

# 例: NestJS (api) にのみ開発用ライブラリを追加する
pnpm --filter api add -D [パッケージ名]

# 例: プロジェクト全体（すべてのパッケージ）に変更を反映する
pnpm install
```

### ビルドと静的解析
```bash
# 依存関係を考慮した正しい順番（shared -> api/web）で全体をビルドする
pnpm build

# 全プロジェクトの Lint チェックを実行する
pnpm lint
```

### データベース (Prisma) 操作
NestJS（`apps/api`）内に構築されているPrismaの操作コマンドです。

```bash
# schema.prisma を変更した後、データベースへ反映する（マイグレーション）
pnpm --filter api exec prisma migrate dev --name [変更内容の名前]

# Prisma Clientの型を再生成する（schema変更後やpull後に実行）
pnpm --filter api exec prisma generate

# SupabaseのGUI（Studio）をローカルで起動する
npx supabase start
```

---

## 3. 新規コードの追加フロー

1. **DB設計の変更**: `apps/api/prisma/schema.prisma` を編集し、マイグレーションを実行。
2. **バリデーションの定義**: `packages/shared/src/schemas/` にZodスキーマを作成し、`index.ts` から export。
3. **バックエンド実装**: `apps/api/src/` にコントローラーとサービスを作成。ZodスキーマからDTOを生成して検証。
4. **フロントエンド実装**: `apps/web/src/` にコンポーネントを作成。Zodスキーマを用いたServer Actionsを作成してAPIを呼び出す。