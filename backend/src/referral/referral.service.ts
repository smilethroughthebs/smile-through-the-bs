/**
 * ==============================================
 * VARLIXO - REFERRAL SERVICE
 * ==============================================
 * Manages referral system including tracking,
 * bonus distribution, and statistics.
 */

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Referral, ReferralDocument, ReferralStatus } from '../schemas/referral.schema';
import { User, UserDocument } from '../schemas/user.schema';
import { Wallet, WalletDocument } from '../schemas/wallet.schema';
import { PaginationDto, createPaginatedResponse } from '../common/dto/pagination.dto';

@Injectable()
export class ReferralService {
  constructor(
    @InjectModel(Referral.name) private referralModel: Model<ReferralDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Wallet.name) private walletModel: Model<WalletDocument>,
  ) {}

  /**
   * Get user's referral statistics
   */
  async getReferralStats(userId: string) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Get all referrals made by this user
    const referrals = await this.referralModel
      .find({ referrerId: new Types.ObjectId(userId) })
      .populate('referredId', 'firstName lastName email createdAt status');

    // Calculate statistics
    const stats = {
      referralCode: user.referralCode,
      totalReferrals: referrals.length,
      activeReferrals: referrals.filter((r) => r.status === ReferralStatus.ACTIVE).length,
      pendingReferrals: referrals.filter((r) => r.status === ReferralStatus.PENDING).length,
      totalEarnings: user.referralEarnings || 0,
      referralLink: `${process.env.FRONTEND_URL}/auth/register?ref=${user.referralCode}`,
    };

    // Get recent referrals
    const recentReferrals = referrals.slice(0, 10).map((ref) => ({
      id: ref._id,
      user: ref.referredId,
      status: ref.status,
      earnings: ref.totalEarnings,
      joinedAt: ref.createdAt,
    }));

    return {
      success: true,
      stats,
      recentReferrals,
    };
  }

  /**
   * Get user's referral list
   */
  async getReferrals(userId: string, paginationDto: PaginationDto) {
    const { page = 1, limit = 10, sortOrder = 'desc' } = paginationDto;
    const skip = (page - 1) * limit;

    const query = { referrerId: new Types.ObjectId(userId) };

    const [referrals, total] = await Promise.all([
      this.referralModel
        .find(query)
        .populate('referredId', 'firstName lastName email createdAt status')
        .sort({ createdAt: sortOrder === 'desc' ? -1 : 1 })
        .skip(skip)
        .limit(limit),
      this.referralModel.countDocuments(query),
    ]);

    return createPaginatedResponse(referrals, total, page, limit);
  }

  /**
   * Get referral earnings history
   */
  async getReferralEarnings(userId: string, paginationDto: PaginationDto) {
    const { page = 1, limit = 20 } = paginationDto;

    const referrals = await this.referralModel
      .find({ referrerId: new Types.ObjectId(userId) })
      .populate('referredId', 'firstName lastName');

    // Flatten all bonuses into a single array
    const allBonuses: any[] = [];
    referrals.forEach((ref) => {
      ref.bonuses.forEach((bonus) => {
        allBonuses.push({
          referredUser: ref.referredId,
          ...bonus,
        });
      });
    });

    // Sort by date descending
    allBonuses.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // Paginate
    const total = allBonuses.length;
    const start = (page - 1) * limit;
    const paginatedBonuses = allBonuses.slice(start, start + limit);

    return createPaginatedResponse(paginatedBonuses, total, page, limit);
  }

  /**
   * Validate referral code
   */
  async validateReferralCode(code: string) {
    const user = await this.userModel.findOne({ referralCode: code });
    
    if (!user) {
      return {
        success: false,
        valid: false,
        message: 'Invalid referral code',
      };
    }

    return {
      success: true,
      valid: true,
      referrer: {
        firstName: user.firstName,
      },
    };
  }
}



