import { Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request } from 'express';

export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger(LoggerMiddleware.name);
  use(req: Request, res: Response, next: NextFunction) {
    this.logger.log('Logger middleware');
    next();
  }
}
