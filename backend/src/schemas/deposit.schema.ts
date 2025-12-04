/**
 * ==============================================
 * VARLIXO - DEPOSIT SCHEMA
 * ==============================================
 * Manages deposit requests and their processing status.
 * Supports both cryptocurrency and bank deposits.
 */

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { PaymentMethod, TransactionStatus } from './transaction.schema';

export type DepositDocument = Deposit & Document;

@Schema({ timestamps: true })
export class Deposit {
  // Reference to user
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  userId: Types.ObjectId;

  // Deposit reference ID (unique constraint creates index)
  @Prop({ required: true, unique: true })
  depositRef: string;

  // Amount details
  @Prop({ required: true, min: 0 })
  amount: number;

  @Prop({ default: 'USD' })
  currency: string;

  // Equivalent amounts in other currencies (for crypto deposits)
  @Prop()
  cryptoAmount: number;

  @Prop()
  cryptoCurrency: string;

  @Prop()
  exchangeRate: number;

  // Payment method
  @Prop({ type: String, enum: PaymentMethod, required: true })
  paymentMethod: PaymentMethod;

  // Status
  @Prop({ type: String, enum: TransactionStatus, default: TransactionStatus.PENDING })
  status: TransactionStatus;

  // Crypto deposit details
  @Prop()
  depositAddress: string;

  @Prop()
  txHash: string;

  @Prop({ default: 0 })
  confirmations: number;

  @Prop({ default: 3 })
  requiredConfirmations: number;

  // Bank deposit details
  @Prop()
  bankName: string;

  @Prop()
  accountNumber: string;

  @Prop()
  accountName: string;

  @Prop()
  referenceNumber: string;

  // Proof of payment
  @Prop()
  proofOfPayment: string;

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

  // Notes
  @Prop()
  userNote: string;

  @Prop()
  adminNote: string;

  // Metadata
  @Prop()
  ipAddress: string;

  @Prop()
  userAgent: string;

  // Expiration (for pending deposits)
  @Prop()
  expiresAt: Date;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

export const DepositSchema = SchemaFactory.createForClass(Deposit);

// Indexes (removed depositRef duplicate - already has unique: true)
DepositSchema.index({ status: 1 });
DepositSchema.index({ txHash: 1 });
DepositSchema.index({ createdAt: -1 });
