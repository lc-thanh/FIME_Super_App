import { IAccessTokenPayload } from '@/interfaces/access-token-payload.interface';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx
      .switchToHttp()
      .getRequest<{ user: IAccessTokenPayload }>();
    return request.user;
  },
);
