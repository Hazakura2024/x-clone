import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CursorPaginationQuery, PostPage } from '@repo/shared';

@Injectable()
export class PostsService {
  constructor(private readonly prisma: PrismaService) {}

  async list({ cursor, limit }: CursorPaginationQuery): Promise<PostPage> {// 以下例としてlimit=20の場合
    const rows = await this.prisma.post.findMany({
      where: { deletedAt: null },
      orderBy: [{ createdAt: 'desc', id: 'desc' }],
      take: limit + 1, // 次のページがあるか判定するために1つ多くとる // 21件取得
      ...(cursor && { cursor: { id: cursor }, skip: 1 }), // cursorは自身も入るが、slip: 1で自身は飛ばす仕様に
      include: {
        author: {
          select: { id: true, handle: true, name: true, avatarUrl: true },
        },
      },
    });

    const hasNext = rows.length > limit;

    const page = hasNext ? rows.slice(0, limit) : rows; // 21件目をカット

    return {
      items: page.map((p) => ({
        id: p.id,
        content: p.content,
        createdAt: p.createdAt.toISOString(),
        author: p.author,
      })),
      nextCursor: hasNext ? page[page.length - 1].id : null, // 20件目(page[19]が次のcursor)
    };
  }
}
