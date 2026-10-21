# インフラ・認証・ストレージ (Supabase)

本プロジェクト「X-Clone」では、バックエンドの主要インフラ（データベース、認証、ストレージ）として **Supabase** を利用し、セキュアかつスケーラブルな構成を実現しています。

---

## 1. ローカル開発環境 (Supabase CLI)

開発環境と本番環境の差異によるバグ（「私の環境では動いたのに」という問題）を防ぐため、ローカル開発では `Supabase CLI` を用いて、Docker上に完全なエミュレート環境を構築します。

### 構成要素
- **PostgreSQL**: Prismaから接続する本体のデータベース（ポート: `54322`）
- **GoTrue (Auth)**: 認証とJWTの発行を担うサーバー
- **Storage**: ファイルストレージのエミュレータ
- **Studio**: ブラウザ（`http://127.0.0.1:54323`）でDBやAuthをGUI操作できる管理画面

### ローカル起動方法
```bash
# プロジェクトルートで実行（Dockerが起動していること）
npx supabase start
```
※終了時は `npx supabase stop` を実行します。

---

## 2. 認証同期トリガー (SQL Trigger)

本プロジェクトの認証は「Supabase Auth（GoTrue）」が担いますが、アプリケーションのビジネスロジック（プロフィールや投稿の管理）は「Prismaが管理する `public.User` テーブル」で行います。

この2つのテーブル間で「ユーザーがサインアップした瞬間」にデータを自動同期するため、データベースレイヤーで **SQL Trigger** を使用しています。これにより、APIサーバーを経由せずに安全かつ確実にデータが連携されます。

### トリガーの仕組み
1. ユーザーがフロントエンドからサインアップを実行。
2. Supabase内部の `auth.users` テーブルにレコードが作成される。
3. 作成を検知したトリガーが発火し、以下の関数（`handle_new_user`）が実行される。
4. Prisma側の `public.User` テーブルに、CUIDv2を発行しながら新規ユーザー行が `INSERT` される。

### トリガー関数の定義例 (マイグレーションに含めるSQL)
```sql
-- ユーザー作成時の関数
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public."User" ("id", "authId", "handle", "name", "updatedAt")
  VALUES (
    -- CUIDv2を生成する拡張関数を別途定義、またはアプリケーション側で補完
    gen_random_uuid()::text, -- ※ローカルでの簡易CUID代替例
    new.id,
    '@' || split_part(new.email, '@', 1), -- メールアドレスの@前を初期ハンドルに
    '名無し',
    now()
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- トリガーの登録
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

---

## 3. メディアのアップロード (Presigned URL)

SNSアプリでは大量の画像や動画のアップロードが発生します。これを Next.js や NestJS のサーバーを経由（プロキシ）させると、サーバーのメモリやネットワーク帯域が逼迫し、高額なインフラコストが発生してしまいます。

これを防ぐため、**Presigned URL（署名付きURL）** パターンを採用しています。

### アップロードのフロー
1. **[Next.js Client]**: 画像を選択し、バックエンドへ「この画像をアップロードしたい」とリクエスト。
2. **[NestJS API]**: Supabase のサーバーサイドSDKを使用し、期限付きの「アップロード専用URL（Presigned URL）」を生成してフロントエンドへ返却。
3. **[Next.js Client]**: 受け取ったPresigned URLに対して、直接画像を `PUT` リクエストで送信。
4. **[Supabase Storage]**: 画像を受け取り、保存。
5. **[Next.js Client]**: アップロード完了後、その画像の公開URLを添えて、NestJSへ「投稿（Post）」の作成リクエストを送信。

### 利点
- NestJS サーバーが巨大なバイナリデータを中継しなくて済むため、負荷が劇的に下がる。
- ユーザーからストレージへ最短ルートで通信されるため、アップロード速度が向上する。
- 認可（アップロード権限のチェック）は事前に NestJS 側で行うため、セキュリティも担保される。