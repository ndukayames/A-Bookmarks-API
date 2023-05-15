import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class NewBookmarkDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description?: string;

  @IsString()
  @IsNotEmpty()
  link: string;
}
