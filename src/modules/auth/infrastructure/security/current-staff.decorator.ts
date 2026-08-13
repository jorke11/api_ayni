import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthenticatedStaff } from './jwt.strategy';

export const CurrentStaff = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): AuthenticatedStaff => {
    const request = ctx.switchToHttp().getRequest<{ user: AuthenticatedStaff }>();
    return request.user;
  },
);
