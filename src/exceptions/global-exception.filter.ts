import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Response } from 'express';

@Catch()
export class GlobalExceptionHandler implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    console.log(exception);
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus ? exception.getStatus() : 500;
    const message = exception.message || 'Internal server error';
    let errorResponse: {
      success: boolean;
      statusCode: number;
      message: any;
      timestamp: string;
      path: string;
    };
    // Customize the response here
    if (exception instanceof Prisma.PrismaClientValidationError) {
      errorResponse = {
        success: false,
        statusCode: 500,
        message: 'Database error.',
        timestamp: new Date().toISOString(),
        path: ctx.getRequest().url,
      };
    } else {
      errorResponse = {
        success: false,
        statusCode: status || 500,
        message: message,
        timestamp: new Date().toISOString(),
        path: ctx.getRequest().url,
      };
    }

    response.status(status).json(errorResponse);
  }
}
