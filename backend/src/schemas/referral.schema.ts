/**
 * ==============================================
 * VARLIXO - REFERRAL SCHEMA
 * ==============================================
 * Tracks referral relationships and bonus payouts.
 * Supports first-level referral system.
 */

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

// Referral status
export enum ReferralStatus {
  PENDING = 'pending', // Referred user hasn't made first deposit
  ACTIVE = 'active', // Referred user is active
  INACTIVE = 'inactive', // Referred user is inactive
}

// Bonus status
export enum BonusStatus {
  PENDING = 'pending',
  PAID = 'paid',
  CANCELLED = 'cancelled',
}

export type ReferralDocument = Referral & Document;

@Schema({ timestamps: true })
export class Referral {
  // Referrer (the user who referred)
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  referrerId: Types.ObjectId;

  // Referred user (the new user)
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  referredId: Types.ObjectId;

  // Referral code used
  @Prop({ required: true })
  referralCode: string;

  // Status
  @Prop({ type: String, enum: ReferralStatus, default: ReferralStatus.PENDING })
  status: ReferralStatus;

  // Earnings from this referral
  @Prop({ default: 0 })
  totalEarnings: number;

  // Bonuses
  @Prop({ type: [{ 
    amount: Number, 
    type: String, 
    status: String, 
    investmentId: Types.ObjectId,
    paidAt: Date,
    createdAt: Date 
  }], default: [] })
  bonuses: Array<{
    amount: number;
    type: string;
    status: string;
    investmentId?: Types.ObjectId;
    paidAt?: Date;
    createdAt: Date;
  }>;

  // Registration bonus
  @Prop({ default: false })
  registrationBonusPaid: boolean;

  @Prop()
  registrationBonusAmount: number;

  // First deposit bonus
  @Prop({ default: false })
  firstDepositBonusPaid: boolean;

  @Prop()
  firstDepositBonusAmount: number;

  // Activity tracking
  @Prop()
  referredUserFirstDeposit: Date;

  @Prop()
  referredUserFirstInvestment: Date;

  @Prop({ default: 0 })
  referredUserTotalInvested: number;

  // Metadata
  @Prop()
  ipAddress: string;

  @Prop()
  userAgent: string;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

export const ReferralSchema = SchemaFactory.createForClass(Referral);

// Indexes
ReferralSchema.index({ referrerId: 1 });
ReferralSchema.index({ referredId: 1 });
ReferralSchema.index({ referralCode: 1 });
ReferralSchema.index({ status: 1 });



