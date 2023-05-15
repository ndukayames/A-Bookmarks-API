import { PartialType } from '@nestjs/mapped-types';
import { NewBookmarkDto } from './new-bookmark';
import { IsNumber } from 'class-validator';

export class UpdateBookmarkDto extends PartialType(NewBookmarkDto) {}
