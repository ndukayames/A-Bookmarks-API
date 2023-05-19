import {
  Body,
  Controller,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SigninDto, SignupDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {
    authService.rest();
  }

  @Post('signup')
  signup(@Body() signupParam: SignupDto) {
    return this.authService.signup(signupParam);
  }
  @Post('signin')
  @HttpCode(200)
  signin(@Body() signinParam: SigninDto) {
    return this.authService.signin(signinParam);
  }
}
