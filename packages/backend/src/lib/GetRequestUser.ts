import {
  ExecutionContext,
  HttpException,
  HttpStatus,
  createParamDecorator,
} from '@nestjs/common';
import type { Request } from 'express';

import type { UserDocument } from '@server/user/entity/user.entity';

export const GetRequestToken = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const req = ctx
      .switchToHttp()
      .getRequest<Request & { existingUser: UserDocument }>();

    const user = req.existingUser;

    return user;
  },
);

export const validateUser = (user: UserDocument | null) => {
  if (!user) {
    throw new HttpException(
      {
        error: {
          user: 'User not found',
        },
      },
      HttpStatus.UNAUTHORIZED,
    );
  }

  return user;
};
