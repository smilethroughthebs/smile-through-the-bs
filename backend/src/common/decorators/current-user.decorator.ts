/**
 * ==============================================
 * VARLIXO - CURRENT USER DECORATOR
 * ==============================================
 * Custom parameter decorator to extract current user from request.
 */

import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Decorator to get the current authenticated user
 * @example getProfile(@CurrentUser() user: UserPayload)
 */
export const CurrentUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    // If a specific property is requested, return that
    if (data) {
      return user?.[data];
    }

    return user;
  },
);



