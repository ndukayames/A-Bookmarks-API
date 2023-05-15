import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { UpdateProfileDto } from './dto';
import { UserService } from './user.service';

@Controller('users')
@UseGuards(JwtGuard)
export class UserController {
  constructor(private userService: UserService) {}
  @Get('me')
  getMe(@GetUser() user: User) {
    return user;
  }

  @Patch('me')
  updateUser(
    @GetUser('id') userId: number,
    @Body() updateData: UpdateProfileDto,
  ) {
    return this.userService.updateUser(userId, updateData);
  }

  @Patch('change-email')
  updateUserEmail(
    @GetUser('id') userId: number,
    @Body('email') newEmail: string,
  ) {
    return this.userService.updateUserEmail(userId, newEmail);
  }

  @Patch('change-password')
  updateUserPassword(
    @GetUser('id') userId: number,
    @Body('password') newPassword: string,
  ) {
    return this.userService.updateUserPassword(userId, newPassword);
  }

  @Delete('me')
  deleteUserAccount(@GetUser('id') userId: number) {
    return this.userService.deleteUserAccount(userId);
  }
}
