/**
 * ==============================================
 * VARLIXO - REFERRAL CONTROLLER
 * ==============================================
 * REST API endpoints for referral operations.
 */

import {
  Controller,
  Get,
  Query,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ReferralService } from './referral.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Public } from '../common/decorators/public.decorator';
import { PaginationDto } from '../common/dto/pagination.dto';

@Controller('referrals')
export class ReferralController {
  constructor(private readonly referralService: ReferralService) {}

  /**
   * Validate a referral code (public)
   * GET /referrals/validate/:code
   */
  @Public()
  @Get('validate/:code')
  async validateReferralCode(@Param('code') code: string) {
    return this.referralService.validateReferralCode(code);
  }

  /**
   * Get user's referral statistics
   * GET /referrals/stats
   */
  @UseGuards(JwtAuthGuard)
  @Get('stats')
  async getReferralStats(@CurrentUser('sub') userId: string) {
    return this.referralService.getReferralStats(userId);
  }

  /**
   * Get user's referral list
   * GET /referrals
   */
  @UseGuards(JwtAuthGuard)
  @Get()
  async getReferrals(
    @CurrentUser('sub') userId: string,
    @Query() paginationDto: PaginationDto,
  ) {
    return this.referralService.getReferrals(userId, paginationDto);
  }

  /**
   * Get referral earnings history
   * GET /referrals/earnings
   */
  @UseGuards(JwtAuthGuard)
  @Get('earnings')
  async getReferralEarnings(
    @CurrentUser('sub') userId: string,
    @Query() paginationDto: PaginationDto,
  ) {
    return this.referralService.getReferralEarnings(userId, paginationDto);
  }
}


