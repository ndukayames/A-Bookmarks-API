import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable, map, of } from 'rxjs';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log('request is being logged');
    let request = context.switchToHttp().getRequest<Request>();
    console.log(request.body);

    return next.handle().pipe(
      map((data: any) => ({
        success: true,
        statusCode: context.switchToHttp().getResponse().statusCode,
        result: data,
      })),
    );
  }
}
