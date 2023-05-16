import { ApiProperty } from '@nestjs/swagger';
import {
  IsAlphanumeric,
  IsEmail,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';

export class SignupDto {
  @IsEmail()
  @ApiProperty({
    example: 'jamesobi14@gmail.com',
  })
  email: string;

  @IsNotEmpty()
  @ApiProperty({
    example: 'my$3curepa$$word',
  })
  password: string;

  @IsAlphanumeric()
  @IsOptional()
  @ApiProperty({
    example: 'james',
  })
  firstName?: string;

  @IsAlphanumeric()
  @IsOptional()
  @ApiProperty({
    example: 'nduka',
  })
  lastName?: string;
}
