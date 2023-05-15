import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { PagingDto } from 'src/shared/dto/paging.dto';

export const GetPagingData = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const limit = parseInt(request.query.limit, 10);
    const page = parseInt(request.query.page, 10);
    const skip = (page - 1) * limit;
    const pageData: PagingDto = { limit, skip };
    return pageData;
  },
);
