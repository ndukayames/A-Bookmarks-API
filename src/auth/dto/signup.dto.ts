import {
  IsAlphanumeric,
  IsEmail,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';

export class SignupDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsAlphanumeric()
  @IsOptional()
  firstName?: string;

  @IsAlphanumeric()
  @IsOptional()
  lastName?: string;
}
