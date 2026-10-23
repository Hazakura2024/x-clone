import { createZodDto } from 'nestjs-zod';
import { cursorPaginationQuerySchema } from '@repo/shared';

export class cursorPaginationQueryDto extends createZodDto(cursorPaginationQuerySchema) {}
