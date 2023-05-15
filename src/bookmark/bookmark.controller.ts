import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from 'src/auth/guard';
import { BookmarkService } from './bookmark.service';
import { NewBookmarkDto } from './dto';
import { GetUser } from 'src/auth/decorator';
import { UpdateBookmarkDto } from './dto/update-bookmark.dto';

@Controller('bookmarks')
@UseGuards(JwtGuard)
export class BookmarkController {
  constructor(private bookmarkService: BookmarkService) {}

  @Get()
  test() {
    return 'working';
  }
  @Post()
  createBookmark(
    @GetUser('id') userId: number,
    @Body() newBookmarkData: NewBookmarkDto,
  ) {
    return this.bookmarkService.createBookmark(userId, newBookmarkData);
  }

  @Patch(':id')
  updateBookmark(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) bookmarkId: number,
    @Body() updatebookmarkDto: UpdateBookmarkDto,
  ) {
    return this.bookmarkService.updateBookmark(
      userId,
      bookmarkId,
      updatebookmarkDto,
    );
  }

  @Delete(':id')
  deleteBookmark(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) bookmarkId: number,
  ) {
    return this.bookmarkService.deleteBookmark(userId, bookmarkId);
  }
}
