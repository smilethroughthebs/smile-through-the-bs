/**
 * ==============================================
 * VARLIXO - TRANSACTION SCHEMA
 * ==============================================
 * Records all financial transactions in the system.
 * Provides complete audit trail for deposits, withdrawals, and transfers.
 */

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

// Transaction types
export enum TransactionType {
  DEPOSIT = 'deposit',
  WITHDRAWAL = 'withdrawal',
  INVESTMENT = 'investment',
  PROFIT = 'profit',
  REFERRAL_BONUS = 'referral_bonus',
  BONUS = 'bonus',
  FEE = 'fee',
  REFUND = 'refund',
  TRANSFER = 'transfer',
}

// Transaction status
export enum TransactionStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
  REJECTED = 'rejected',
}

// Payment methods
export enum PaymentMethod {
  BANK_TRANSFER = 'bank_transfer',
  CRYPTO_BTC = 'crypto_btc',
  CRYPTO_ETH = 'crypto_eth',
  CRYPTO_USDT = 'crypto_usdt',
  CRYPTO_USDC = 'crypto_usdc',
  PAYPAL = 'paypal',
  CARD = 'card',
  INTERNAL = 'internal',
}

export type TransactionDocument = Transaction & Document;

@Schema({ timestamps: true })
export class Transaction {
  // Reference to user
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  userId: Types.ObjectId;

  // Unique transaction reference
  @Prop({ required: true, unique: true })
  transactionRef: string;

  // Transaction details
  @Prop({ type: String, enum: TransactionType, required: true })
  type: TransactionType;

  @Prop({ type: String, enum: TransactionStatus, default: TransactionStatus.PENDING })
  status: TransactionStatus;

  @Prop({ required: true, min: 0 })
  amount: number;

  @Prop({ default: 'USD' })
  currency: string;

  @Prop({ default: 0 })
  fee: number;

  @Prop()
  netAmount: number;

  // Payment method details
  @Prop({ type: String, enum: PaymentMethod })
  paymentMethod: PaymentMethod;

  @Prop()
  paymentDetails: string;

  // For crypto transactions
  @Prop()
  txHash: string;

  @Prop()
  fromAddress: string;

  @Prop()
  toAddress: string;

  @Prop()
  confirmations: number;

  // For bank transfers
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

  // Reference to related entities
  @Prop({ type: Types.ObjectId, ref: 'Investment' })
  investmentId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  referredUserId: Types.ObjectId;

  // Balance tracking
  @Prop()
  balanceBefore: number;

  @Prop()
  balanceAfter: number;

  // Description and notes
  @Prop()
  description: string;

  @Prop()
  adminNote: string;

  // Processing details
  @Prop({ type: Types.ObjectId, ref: 'User' })
  processedBy: Types.ObjectId;

  @Prop()
  processedAt: Date;

  // Metadata
  @Prop()
  ipAddress: string;

  @Prop()
  userAgent: string;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);

// Indexes for efficient queries (removed transactionRef - already has unique: true)
TransactionSchema.index({ type: 1 });
TransactionSchema.index({ status: 1 });
TransactionSchema.index({ createdAt: -1 });
