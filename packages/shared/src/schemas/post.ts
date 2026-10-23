import z from "zod";
import { cursorPageSchema } from "./pagination";

export const postSchema = z.object({
  id: z.string(),
  content: z.string(),
  createdAt: z.string(),
  author: z.object({
    id: z.string(),
    handle: z.string(),
    name: z.string(),
    avatarUrl: z.string().nullable(),
  }),
});
export type Post = z.infer<typeof postSchema>;

// メインのタイムラインをレスポンスで返す用のスキーマ
export const postPageSchema = cursorPageSchema(postSchema);

export type PostPage = z.infer<typeof postPageSchema>;
