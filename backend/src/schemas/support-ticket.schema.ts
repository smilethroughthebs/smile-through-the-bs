/**
 * ==============================================
 * VARLIXO - SUPPORT TICKET SCHEMA
 * ==============================================
 * Manages customer support tickets and conversations.
 * Supports ticket categories and priority levels.
 */

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

// Ticket status
export enum TicketStatus {
  OPEN = 'open',
  IN_PROGRESS = 'in_progress',
  WAITING_RESPONSE = 'waiting_response',
  RESOLVED = 'resolved',
  CLOSED = 'closed',
}

// Ticket priority
export enum TicketPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
}

// Ticket category
export enum TicketCategory {
  ACCOUNT = 'account',
  DEPOSIT = 'deposit',
  WITHDRAWAL = 'withdrawal',
  INVESTMENT = 'investment',
  KYC = 'kyc',
  TECHNICAL = 'technical',
  SECURITY = 'security',
  OTHER = 'other',
}

// Message sub-schema
@Schema({ _id: false })
class TicketMessage {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  senderId: Types.ObjectId;

  @Prop({ required: true })
  message: string;

  @Prop({ type: [String], default: [] })
  attachments: string[];

  @Prop({ default: false })
  isAdmin: boolean;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: false })
  isRead: boolean;
}

const TicketMessageSchema = SchemaFactory.createForClass(TicketMessage);

export type SupportTicketDocument = SupportTicket & Document;

@Schema({ timestamps: true })
export class SupportTicket {
  // Reference to user
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  // Ticket reference
  @Prop({ required: true, unique: true })
  ticketRef: string;

  // Ticket details
  @Prop({ required: true })
  subject: string;

  @Prop({ type: String, enum: TicketCategory, required: true })
  category: TicketCategory;

  @Prop({ type: String, enum: TicketPriority, default: TicketPriority.MEDIUM })
  priority: TicketPriority;

  @Prop({ type: String, enum: TicketStatus, default: TicketStatus.OPEN })
  status: TicketStatus;

  // Messages
  @Prop({ type: [TicketMessageSchema], default: [] })
  messages: TicketMessage[];

  // Assignment
  @Prop({ type: Types.ObjectId, ref: 'User' })
  assignedTo: Types.ObjectId;

  @Prop()
  assignedAt: Date;

  // Resolution
  @Prop()
  resolvedAt: Date;

  @Prop()
  resolutionNote: string;

  // Feedback
  @Prop({ min: 1, max: 5 })
  rating: number;

  @Prop()
  feedback: string;

  // Related entity
  @Prop()
  relatedEntity: string;

  @Prop({ type: Types.ObjectId })
  relatedId: Types.ObjectId;

  // Metadata
  @Prop()
  ipAddress: string;

  @Prop()
  userAgent: string;

  // Last activity
  @Prop()
  lastActivityAt: Date;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

export const SupportTicketSchema = SchemaFactory.createForClass(SupportTicket);

// Indexes
SupportTicketSchema.index({ userId: 1, createdAt: -1 });
SupportTicketSchema.index({ ticketRef: 1 });
SupportTicketSchema.index({ status: 1 });
SupportTicketSchema.index({ assignedTo: 1 });
SupportTicketSchema.index({ createdAt: -1 });



