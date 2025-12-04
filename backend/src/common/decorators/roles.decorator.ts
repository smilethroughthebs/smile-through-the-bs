/**
 * ==============================================
 * VARLIXO - ROLES DECORATOR
 * ==============================================
 * Custom decorator to specify required roles for routes.
 */

import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../../schemas/user.schema';

export const ROLES_KEY = 'roles';

/**
 * Decorator to specify required roles for a route
 * @param roles - Array of allowed roles
 * @example @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
 */
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);



