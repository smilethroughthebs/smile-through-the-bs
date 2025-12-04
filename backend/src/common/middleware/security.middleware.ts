/**
 * ==============================================
 * VARLIXO - SECURITY MIDDLEWARE
 * ==============================================
 * Adds security headers and performs basic security checks.
 */

import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class SecurityMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // Add security headers
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

    // Remove X-Powered-By header
    res.removeHeader('X-Powered-By');

    // Add request timestamp
    req['requestTime'] = Date.now();

    next();
  }
}




