import z from "zod";

// メインのタイムラインを取得するクエリ用のスキーマ
export const cursorPaginationQuerySchema = z.object({
  cursor: z.string().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});

export type CursorPaginationSchema = z.infer<
  typeof cursorPaginationQuerySchema
>;

// 色々な中身を複数にして、レスポンスにするスキーマ
export const cursorPageSchema = <T extends z.ZodType>(item: T) =>
  z.object({
    items: z.array(item),
    nextCursor: z.string().nullable(),
  });
