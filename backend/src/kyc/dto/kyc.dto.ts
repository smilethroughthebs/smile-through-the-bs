/**
 * ==============================================
 * VARLIXO - KYC DTOs
 * ==============================================
 * Validation DTOs for KYC operations.
 */

import {
  IsString,
  IsOptional,
  IsNotEmpty,
  IsEnum,
  IsDateString,
} from 'class-validator';
import { KycDocumentType } from '../../schemas/kyc.schema';

export class SubmitKycDto {
  @IsEnum(KycDocumentType)
  documentType: KycDocumentType;

  @IsOptional()
  @IsString()
  documentNumber?: string;

  @IsOptional()
  @IsString()
  issuingCountry?: string;

  @IsOptional()
  @IsDateString()
  issueDate?: string;

  @IsOptional()
  @IsDateString()
  expiryDate?: string;

  @IsOptional()
  @IsString()
  fullNameOnDocument?: string;

  @IsOptional()
  @IsDateString()
  dateOfBirthOnDocument?: string;

  @IsOptional()
  @IsString()
  addressOnDocument?: string;
}

export class AdminReviewKycDto {
  @IsString()
  @IsNotEmpty()
  kycId: string;

  @IsEnum(['approved', 'rejected'])
  decision: 'approved' | 'rejected';

  @IsOptional()
  @IsString()
  rejectionReason?: string;

  @IsOptional()
  @IsString()
  adminNote?: string;
}



