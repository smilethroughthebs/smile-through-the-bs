/**
 * ==============================================
 * VARLIXO - NOTIFICATION SCHEMA
 * ==============================================
 * Manages in-app notifications for users.
 * Supports various notification types and read status.
 */

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

// Notification types
export enum NotificationType {
  SYSTEM = 'system',
  DEPOSIT = 'deposit',
  WITHDRAWAL = 'withdrawal',
  INVESTMENT = 'investment',
  PROFIT = 'profit',
  REFERRAL = 'referral',
  KYC = 'kyc',
  SECURITY = 'security',
  PROMOTION = 'promotion',
  ANNOUNCEMENT = 'announcement',
}

// Notification priority
export enum NotificationPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
}

export type NotificationDocument = Notification & Document;

@Schema({ timestamps: true })
export class Notification {
  // Recipient user
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  // Notification content
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  message: string;

  // Type and priority
  @Prop({ type: String, enum: NotificationType, required: true })
  type: NotificationType;

  @Prop({ type: String, enum: NotificationPriority, default: NotificationPriority.MEDIUM })
  priority: NotificationPriority;

  // Read status
  @Prop({ default: false })
  isRead: boolean;

  @Prop()
  readAt: Date;

  // Action link
  @Prop()
  actionUrl: string;

  @Prop()
  actionText: string;

  // Related entity
  @Prop()
  relatedEntity: string; // e.g., 'deposit', 'investment'

  @Prop({ type: Types.ObjectId })
  relatedId: Types.ObjectId;

  // Email notification
  @Prop({ default: false })
  emailSent: boolean;

  @Prop()
  emailSentAt: Date;

  // Metadata
  @Prop()
  icon: string;

  @Prop()
  color: string;

  // Expiration
  @Prop()
  expiresAt: Date;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);

// Indexes
NotificationSchema.index({ userId: 1, createdAt: -1 });
NotificationSchema.index({ userId: 1, isRead: 1 });
NotificationSchema.index({ type: 1 });
NotificationSchema.index({ createdAt: -1 });




