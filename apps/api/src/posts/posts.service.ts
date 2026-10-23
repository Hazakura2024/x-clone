import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CursorPaginationQuery, PostPage } from '@repo/shared';

@Injectable()
export class PostsService {
  constructor(private readonly prisma: PrismaService) {}

  async list({ cursor, limit }: CursorPaginationQuery): Promise<PostPage> {
    const rows = await this.prisma.post.findMany({
      where: { deletedAt: null },
      orderBy: [{ createdAt: 'desc', id: 'desc' }],
      take: limit + 1, // 次のページがあるか判定するために1つ多くとる
      ...(cursor && { cursor: { id: cursor }, skip: 1 }),
      include: {
        author: {
          select: { id: true, handle: true, name: true, avatarUrl: true },
        },
      },
    });

    const hasNext = rows.length > limit;

    const page = hasNext ? rows.slice(0, limit) : rows;

    return {
      items: page.map((p) => ({
        id: p.id,
        content: p.content,
        createdAt: p.createdAt.toISOString(),
        author: p.author,
      })),
      nextCursor: hasNext ? page[page.length - 1].id : null,
    };
  }
}
