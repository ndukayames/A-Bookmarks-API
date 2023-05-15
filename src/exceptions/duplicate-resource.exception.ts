import { HttpException, HttpStatus } from '@nestjs/common';

export class DuplicateResourceException extends HttpException {
  constructor(private resource: string, private resourceValue: string) {
    super(
      `Resource ${resource} with value ${resourceValue} already exists.`,
      HttpStatus.BAD_REQUEST,
    );
  }
}
