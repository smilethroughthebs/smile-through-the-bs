/**
 * ==============================================
 * VARLIXO - WITHDRAWAL SCHEMA
 * ==============================================
 * Manages withdrawal requests and their processing.
 * Supports cryptocurrency and bank withdrawals.
 */

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { PaymentMethod, TransactionStatus } from './transaction.schema';

export type WithdrawalDocument = Withdrawal & Document;

@Schema({ timestamps: true })
export class Withdrawal {
  // Reference to user
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  userId: Types.ObjectId;

  // Withdrawal reference ID (unique constraint creates index)
  @Prop({ required: true, unique: true })
  withdrawalRef: string;

  // Amount details
  @Prop({ required: true, min: 0 })
  amount: number;

  @Prop({ default: 'USD' })
  currency: string;

  @Prop({ default: 0 })
  fee: number;

  @Prop()
  netAmount: number;

  // Payment method
  @Prop({ type: String, enum: PaymentMethod, required: true })
  paymentMethod: PaymentMethod;

  // Status
  @Prop({ type: String, enum: TransactionStatus, default: TransactionStatus.PENDING })
  status: TransactionStatus;

  // Crypto withdrawal details
  @Prop()
  walletAddress: string;

  @Prop()
  network: string;

  @Prop()
  txHash: string;

  // Bank withdrawal details
  @Prop()
  bankName: string;

  @Prop()
  accountNumber: string;

  @Prop()
  accountName: string;

  @Prop()
  routingNumber: string;

  @Prop()
  swiftCode: string;

  @Prop()
  bankAddress: string;

  @Prop()
  iban: string;

  // Processing
  @Prop({ type: Types.ObjectId, ref: 'User' })
  approvedBy: Types.ObjectId;

  @Prop()
  approvedAt: Date;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  rejectedBy: Types.ObjectId;

  @Prop()
  rejectedAt: Date;

  @Prop()
  rejectionReason: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  processedBy: Types.ObjectId;

  @Prop()
  processedAt: Date;

  // 2FA verification
  @Prop({ default: false })
  twoFactorVerified: boolean;

  // Notes
  @Prop()
  userNote: string;

  @Prop()
  adminNote: string;

  // Security
  @Prop()
  ipAddress: string;

  @Prop()
  userAgent: string;

  // Balance at time of request
  @Prop()
  balanceAtRequest: number;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

export const WithdrawalSchema = SchemaFactory.createForClass(Withdrawal);

// Indexes (removed withdrawalRef duplicate - already has unique: true)
WithdrawalSchema.index({ status: 1 });
WithdrawalSchema.index({ createdAt: -1 });
