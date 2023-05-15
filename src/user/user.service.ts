import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateProfileDto } from './dto';
import { Prisma } from '@prisma/client';
import { DuplicateResourceException } from 'src/exceptions/duplicate-resource.exception';

import * as argon from 'argon2';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async updateUser(userId: number, updateData: UpdateProfileDto) {
    const updateParam: Prisma.UserUpdateInput = {
      ...updateData,
    };
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: updateParam,
    });

    const { password, ...result } = user;

    return result;
  }

  async updateUserEmail(userId: number, newEmail: string) {
    // check if email belongs to another user
    const existingUser = await this.prisma.user.findUnique({
      where: {
        email: newEmail,
      },
    });

    if (existingUser) throw new DuplicateResourceException('User', newEmail);

    // update user
    const updateParam: Prisma.UserUpdateInput = {
      email: newEmail,
    };
    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: updateParam,
    });

    const { password, ...result } = updatedUser;

    return result;
  }

  async updateUserPassword(userId: number, newPassword: string) {
    // update user
    const updateParam: Prisma.UserUpdateInput = {
      password: await argon.hash(newPassword),
    };
    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: updateParam,
    });

    const { password, ...result } = updatedUser;

    return result;
  }

  async deleteUserAccount(userId: number) {
    return await this.prisma.user.delete({
      where: {
        id: userId,
      },
    });
  }
}
