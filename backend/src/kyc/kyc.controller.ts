/**
 * ==============================================
 * VARLIXO - KYC CONTROLLER
 * ==============================================
 * REST API endpoints for KYC operations.
 */

import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
  Req,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Request } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { extname } from 'path';
import { KycService } from './kyc.service';
import { SubmitKycDto, AdminReviewKycDto } from './dto/kyc.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { AdminGuard } from '../common/guards/admin.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { PaginationDto } from '../common/dto/pagination.dto';
import { getClientIp } from '../common/utils/helpers';

@Controller('kyc')
@UseGuards(JwtAuthGuard)
export class KycController {
  constructor(private readonly kycService: KycService) {}

  /**
   * Submit KYC documents
   * POST /kyc/submit
   */
  @Post('submit')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'frontImage', maxCount: 1 },
        { name: 'backImage', maxCount: 1 },
        { name: 'selfieImage', maxCount: 1 },
      ],
      {
        storage: diskStorage({
          destination: './uploads/kyc',
          filename: (req, file, callback) => {
            const uniqueSuffix = uuidv4();
            const ext = extname(file.originalname);
            callback(null, `kyc-${file.fieldname}-${uniqueSuffix}${ext}`);
          },
        }),
        limits: {
          fileSize: 10 * 1024 * 1024, // 10MB
        },
        fileFilter: (req, file, callback) => {
          if (!file.mimetype.match(/\/(jpg|jpeg|png|pdf)$/)) {
            callback(new Error('Only image and PDF files are allowed'), false);
          }
          callback(null, true);
        },
      },
    ),
  )
  async submitKyc(
    @CurrentUser('sub') userId: string,
    @Body() submitKycDto: SubmitKycDto,
    @UploadedFiles()
    files: {
      frontImage?: Express.Multer.File[];
      backImage?: Express.Multer.File[];
      selfieImage?: Express.Multer.File[];
    },
    @Req() req: Request,
  ) {
    const frontImage = files.frontImage?.[0]?.path;
    const backImage = files.backImage?.[0]?.path;
    const selfieImage = files.selfieImage?.[0]?.path;

    if (!frontImage) {
      throw new Error('Front image is required');
    }

    const ipAddress = getClientIp(req);
    const userAgent = req.headers['user-agent'];

    return this.kycService.submitKyc(
      userId,
      submitKycDto,
      frontImage,
      backImage,
      selfieImage,
      ipAddress,
      userAgent,
    );
  }

  /**
   * Get user's KYC status
   * GET /kyc/status
   */
  @Get('status')
  async getKycStatus(@CurrentUser('sub') userId: string) {
    return this.kycService.getKycStatus(userId);
  }

  // ==========================================
  // ADMIN ENDPOINTS
  // ==========================================

  /**
   * Admin: Get all pending KYC submissions
   * GET /kyc/admin/pending
   */
  @Get('admin/pending')
  @UseGuards(AdminGuard)
  async getAllPendingKyc(@Query() paginationDto: PaginationDto) {
    return this.kycService.getAllPendingKyc(paginationDto);
  }

  /**
   * Admin: Get KYC details
   * GET /kyc/admin/:id
   */
  @Get('admin/:id')
  @UseGuards(AdminGuard)
  async getKycDetails(@Param('id') kycId: string) {
    return this.kycService.getKycDetails(kycId);
  }

  /**
   * Admin: Review KYC submission
   * POST /kyc/admin/review
   */
  @Post('admin/review')
  @UseGuards(AdminGuard)
  async reviewKyc(
    @CurrentUser('sub') adminId: string,
    @Body() reviewDto: AdminReviewKycDto,
  ) {
    return this.kycService.reviewKyc(adminId, reviewDto);
  }
}


