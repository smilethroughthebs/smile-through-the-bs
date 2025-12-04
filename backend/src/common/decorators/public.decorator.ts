/**
 * ==============================================
 * VARLIXO - PUBLIC DECORATOR
 * ==============================================
 * Marks routes as public (no authentication required).
 */

import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';

/**
 * Decorator to mark a route as public (no auth required)
 * @example @Public()
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);




