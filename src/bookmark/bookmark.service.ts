import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { NewBookmarkDto } from './dto';
import { Prisma } from '@prisma/client';
import { UpdateBookmarkDto } from './dto/update-bookmark.dto';
import { PagingDto } from 'src/shared/dto/paging.dto';

@Injectable()
export class BookmarkService {
  private bookmarks: Prisma.BookmarkDelegate<any>;

  constructor(private prisma: PrismaService) {
    this.bookmarks = prisma.bookmark;
  }

  async createBookmark(userId: number, newBookmarkData: NewBookmarkDto) {
    console.log(1);

    try {
      const newBookmarkInput = {
        title: newBookmarkData.title,
        link: newBookmarkData.link,
        description: newBookmarkData.description,
      };
      return this.bookmarks.create({
        data: {
          userId: userId,
          ...newBookmarkInput,
        },
      });
    } catch (error) {
      console.log(error);
      throw new BadRequestException('error creating bookmark');
    }
  }

  async updateBookmark(
    userId: number,
    bookmarkId: number,
    updateBookmarkDto: UpdateBookmarkDto,
  ) {
    const bookmark = await this.bookmarks.findFirst({
      where: {
        id: bookmarkId,
        userId: userId,
      },
    });

    if (!bookmark) throw new NotFoundException('bookmark not found.');

    const updatedBookmark = await this.bookmarks.update({
      where: {
        id: bookmarkId,
      },
      data: {
        ...updateBookmarkDto,
      },
    });
    return updatedBookmark;
  }

  async deleteBookmark(userId: number, bookmarkId: number) {
    const bookmark = await this.bookmarks.findFirst({
      where: {
        id: bookmarkId,
        userId: userId,
      },
    });

    if (!bookmark) throw new NotFoundException('bookmark not found.');

    return await this.bookmarks.delete({
      where: {
        id: bookmarkId,
      },
    });
  }

  async getOneOfMyBookmarks(userId: number, bookmarkId: number) {
    const bookmark = await this.bookmarks.findFirst({
      where: {
        id: bookmarkId,
        userId: userId,
      },
    });

    if (!bookmark)
      throw new NotFoundException('bookmark not found for this user.');

    return bookmark;
  }

  async getAllOfMyBookmarks(userId: number, pageParam: PagingDto) {
    const bookmarks = await this.bookmarks.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip: pageParam.skip,
      take: pageParam.limit,
    });

    return bookmarks;
  }

  async getOneBookmark(bookmarkId: number) {
    const bookmark = await this.bookmarks.findFirst({
      where: {
        id: bookmarkId,
      },
    });

    if (!bookmark) throw new NotFoundException('bookmark not found.');

    return bookmark;
  }
}
