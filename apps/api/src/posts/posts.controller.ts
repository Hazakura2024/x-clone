import { Controller, Get, Query } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CursorPaginationQueryDto } from '../common/cursor-pagination-query.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  list(@Query() query: CursorPaginationQueryDto) {
    return this.postsService.list(query);
  }
}
