/**
 * ==============================================
 * VARLIXO - EMAIL CONTROLLER
 * ==============================================
 * Admin endpoints for email system management.
 */

import { Controller, Get, UseGuards } from '@nestjs/common';
import { EmailService } from './email.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('email')
@UseGuards(JwtAuthGuard)
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  /**
   * Test SMTP connection (requires authentication)
   * GET /email/test-connection
   */
  @Get('test-connection')
  async testConnection() {
    return this.emailService.testConnection();
  }
}
