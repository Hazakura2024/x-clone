# APIインターフェース設計 (Zod共有バリデーション)

本プロジェクト「X-Clone」では、Next.js（フロントエンド）とNestJS（バックエンド）間の通信ルールとバリデーションを、**モノレポ構成とZodを活かして完全一元化**しています。

---

## 1. バリデーションの共有戦略

「フロントエンドのフォーム検証」と「バックエンドのAPI受信時の検証」で別々のルールを書くと、仕様変更時に必ずズレ（単一障害点）が生じます。
これを防ぐため、`packages/shared` に定義した **Zodスキーマを単一ソース** として両者からインポートして使用します。

### スキーマ定義例 (`packages/shared/src/schemas/post.schema.ts`)
```typescript
import { z } from 'zod';

export const createPostSchema = z.object({
  content: z.string()
    .min(1, '投稿内容を入力してください')
    .max(280, '投稿は280文字以内で入力してください'),
});

// TypeScriptの型もZodから抽出（二重管理を防止）
export type CreatePostInput = z.infer<typeof createPostSchema>;
```

---

## 2. フロントエンド (Next.js) での利用

Next.js側では、ユーザー入力のリアルタイム検証（React Hook Form等）および、サーバーへの送信前の安全確認（Server Actions）にこのスキーマを利用します。

### Server Actions での検証 (`next-safe-action`)
Server Actionsの引数としてZodスキーマを渡すことで、型安全なAPI呼び出し処理を構築します。

```typescript
// apps/web/src/app/actions/post.action.ts
import { actionClient } from '@/lib/safe-action';
import { createPostSchema } from '@repo/shared/schemas';

// フロントエンド側のサーバーでZod検証が走り、通ったものだけが parsedInput に渡る
export const createPostAction = actionClient
  .schema(createPostSchema)
  .action(async ({ parsedInput }) => {
    // この時点で parsedInput は CreatePostInput 型として保証されている
    
    // NestJS API へのリクエスト
    const res = await fetch('http://localhost:3001/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(parsedInput),
    });
    
    return res.json();
  });
```

---

## 3. バックエンド (NestJS) での利用

NestJS側でも、受信したデータが不正でないかをバリデーションパイプラインで検証します。ここでもフロントエンドと**全く同じZodスキーマ**を利用します。

### DTO (Data Transfer Object) への適用 (`nestjs-zod`)
NestJSのDTOクラスを、共有Zodスキーマから直接生成します。

```typescript
// apps/api/src/posts/dto/create-post.dto.ts
import { createZodDto } from 'nestjs-zod';
import { createPostSchema } from '@repo/shared/schemas';

// @repo/shared の Zod スキーマから NestJS 用の DTO クラスを自動生成
export class CreatePostDto extends createZodDto(createPostSchema) {}
```

### コントローラーでの受信
`nestjs-zod` のパイプを設定しておくことで、コントローラーに到達する前に自動でバリデーションとエラーハンドリング（400 Bad Request）が行われます。

```typescript
// apps/api/src/posts/posts.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';

@Controller('posts')
export class PostsController {
  @Post()
  async create(@Body() createPostDto: CreatePostDto) {
    // ここに到達した時点で、createPostDto の content が 1〜280文字であることが完全保証されている
    return this.postsService.create(createPostDto);
  }
}
```

---

## 4. この設計のメリット

- **DRY原則**: 文字数制限が「280文字」から「500文字」に変更された場合、`packages/shared` の1箇所を変更するだけで、フロントエンドのUIエラーメッセージからバックエンドのAPI拒否判定まで、すべてが一瞬で同期されます。
- **型安全性の究極形**: APIの送り手（Next.js）と受け手（NestJS）が、物理的に同じファイルをソースとしているため、実行時エラーの発生確率を極限まで減らすことができます。