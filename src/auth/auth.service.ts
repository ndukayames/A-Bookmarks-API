import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SigninDto, SignupDto } from './dto';
import * as argon from 'argon2';
import { Prisma } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

interface BaseProfileData {
  id: number;
  email: string;
}

@Injectable({})
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async signup(signupData: SignupDto) {
    try {
      const userInput: Prisma.UserCreateInput = {
        email: signupData.email,
        password: await argon.hash(signupData.password),
        firstName: signupData.firstName,
        lastName: signupData.lastName,
      };
      const user = await this.prisma.user.create({
        data: userInput,
      });

      delete user.password;
      return {
        msg: 'signup successful',
        result: await this.generateToken(user),
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('User with this email already exists');
        }
      }
    }
  }

  async signin(signinData: SigninDto): Promise<{
    access_token: string;
  }> {
    // find user
    const findParam: Prisma.UserWhereUniqueInput = {
      email: signinData.email,
    };

    const user = await this.prisma.user.findUnique({
      where: findParam,
    });

    // check if user is found
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // compare password
    const isPasswordMatch = await argon.verify(
      user.password,
      signinData.password,
    );
    if (!isPasswordMatch) {
      throw new UnauthorizedException('Incorrect credentials');
    }

    return this.generateToken(user);
  }

  async generateToken<Type extends BaseProfileData>(
    user: Type,
  ): Promise<{ access_token: string }> {
    const payload = {
      sub: user.id,
      email: user.email,
    };

    const token = await this.jwt.signAsync(payload, {
      expiresIn: '15m',
      secret: this.config.get('JWT_SECRET'),
    });

    return { access_token: token };
  }
}
