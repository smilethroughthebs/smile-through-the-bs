/**
 * ==============================================
 * VARLIXO - KYC DOCUMENT SCHEMA
 * ==============================================
 * Stores KYC verification documents and their status.
 * Supports multiple document types for verification.
 */

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

// Document types
export enum KycDocumentType {
  PASSPORT = 'passport',
  NATIONAL_ID = 'national_id',
  DRIVERS_LICENSE = 'drivers_license',
  RESIDENCE_PERMIT = 'residence_permit',
  UTILITY_BILL = 'utility_bill',
  BANK_STATEMENT = 'bank_statement',
  SELFIE = 'selfie',
}

// Verification status
export enum KycDocumentStatus {
  PENDING = 'pending',
  UNDER_REVIEW = 'under_review',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  EXPIRED = 'expired',
}

export type KycDocument = Kyc & Document;

@Schema({ timestamps: true })
export class Kyc {
  // Reference to user
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  // Document type
  @Prop({ type: String, enum: KycDocumentType, required: true })
  documentType: KycDocumentType;

  // Document details
  @Prop()
  documentNumber: string;

  @Prop()
  issuingCountry: string;

  @Prop()
  issueDate: Date;

  @Prop()
  expiryDate: Date;

  // File paths
  @Prop({ required: true })
  frontImage: string;

  @Prop()
  backImage: string;

  @Prop()
  selfieImage: string;

  // Status
  @Prop({ type: String, enum: KycDocumentStatus, default: KycDocumentStatus.PENDING })
  status: KycDocumentStatus;

  // Verification details
  @Prop({ type: Types.ObjectId, ref: 'User' })
  reviewedBy: Types.ObjectId;

  @Prop()
  reviewedAt: Date;

  @Prop()
  rejectionReason: string;

  @Prop()
  adminNote: string;

  // Additional verification
  @Prop({ default: false })
  isAddressVerification: boolean;

  // Personal info from document
  @Prop()
  fullNameOnDocument: string;

  @Prop()
  dateOfBirthOnDocument: Date;

  @Prop()
  addressOnDocument: string;

  // Metadata
  @Prop()
  ipAddress: string;

  @Prop()
  userAgent: string;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

export const KycSchema = SchemaFactory.createForClass(Kyc);

// Indexes
KycSchema.index({ userId: 1, documentType: 1 });
KycSchema.index({ status: 1 });
KycSchema.index({ createdAt: -1 });




