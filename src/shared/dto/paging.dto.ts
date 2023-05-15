import { IsNumber, IsOptional } from 'class-validator';

export class PagingDto {
  @IsNumber()
  limit: number;
  @IsOptional()
  skip: number;
}
