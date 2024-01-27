import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { UserDocument } from './user/entity/user.entity';
export const GetRequestToken = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    const user = req.existingUser as UserDocument;
    return user;
  },
);
