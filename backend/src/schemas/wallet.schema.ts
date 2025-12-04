/**
 * ==============================================
 * VARLIXO - WALLET SCHEMA
 * ==============================================
 * Manages user wallet balances for different currencies.
 * Supports both fiat and cryptocurrency balances.
 */

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

// Type definition for Wallet document
export type WalletDocument = Wallet & Document;

// Sub-schema for individual currency balance
@Schema({ _id: false })
class CurrencyBalance {
  @Prop({ required: true })
  currency: string;

  @Prop({ default: 0, min: 0 })
  available: number;

  @Prop({ default: 0, min: 0 })
  pending: number;

  @Prop({ default: 0, min: 0 })
  locked: number;

  @Prop({ default: 0 })
  totalDeposited: number;

  @Prop({ default: 0 })
  totalWithdrawn: number;
}

const CurrencyBalanceSchema = SchemaFactory.createForClass(CurrencyBalance);

@Schema({ timestamps: true })
export class Wallet {
  // Reference to the user (unique constraint creates index automatically)
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, unique: true })
  userId: Types.ObjectId;

  // Main fiat balance (USD)
  @Prop({ default: 0, min: 0 })
  mainBalance: number;

  @Prop({ default: 0, min: 0 })
  pendingBalance: number;

  @Prop({ default: 0, min: 0 })
  lockedBalance: number;

  // Total earnings from investments
  @Prop({ default: 0 })
  totalEarnings: number;

  // Total referral earnings
  @Prop({ default: 0 })
  referralEarnings: number;

  // Crypto balances
  @Prop({ type: [CurrencyBalanceSchema], default: [] })
  cryptoBalances: CurrencyBalance[];

  // Wallet addresses for deposits
  @Prop({ type: Map, of: String, default: {} })
  depositAddresses: Map<string, string>;

  // Last balance update
  @Prop()
  lastUpdated: Date;

  // Is wallet frozen
  @Prop({ default: false })
  isFrozen: boolean;

  @Prop()
  frozenReason: string;

  @Prop()
  frozenAt: Date;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

export const WalletSchema = SchemaFactory.createForClass(Wallet);

// No additional indexes needed - userId unique constraint creates one automatically
