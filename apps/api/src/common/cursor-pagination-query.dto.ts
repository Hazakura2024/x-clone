import { createZodDto } from 'nestjs-zod';
import { cursorPaginationQuerySchema } from '@repo/shared';

export class CursorPaginationQueryDto extends createZodDto(
  cursorPaginationQuerySchema,
) {}
