/**
 * ==============================================
 * VARLIXO - WALLET SERVICE
 * ==============================================
 * Manages wallet operations including deposits,
 * withdrawals, and balance management with email notifications.
 */

import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as speakeasy from 'speakeasy';
import { Wallet, WalletDocument } from '../schemas/wallet.schema';
import { User, UserDocument, KycStatus } from '../schemas/user.schema';
import { Deposit, DepositDocument } from '../schemas/deposit.schema';
import { Withdrawal, WithdrawalDocument } from '../schemas/withdrawal.schema';
import {
  Transaction,
  TransactionDocument,
  TransactionType,
  TransactionStatus,
  PaymentMethod,
} from '../schemas/transaction.schema';
import { CreateDepositDto, CreateWithdrawalDto } from './dto/wallet.dto';
import { generateReference, roundTo } from '../common/utils/helpers';
import { PaginationDto, createPaginatedResponse } from '../common/dto/pagination.dto';
import { EmailService } from '../email/email.service';

@Injectable()
export class WalletService {
  constructor(
    @InjectModel(Wallet.name) private walletModel: Model<WalletDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Deposit.name) private depositModel: Model<DepositDocument>,
    @InjectModel(Withdrawal.name) private withdrawalModel: Model<WithdrawalDocument>,
    @InjectModel(Transaction.name) private transactionModel: Model<TransactionDocument>,
    private emailService: EmailService,
  ) {}

  /**
   * Get user wallet
   */
  async getWallet(userId: string) {
    const wallet = await this.walletModel.findOne({ userId: new Types.ObjectId(userId) });

    if (!wallet) {
      // Create wallet if doesn't exist
      const newWallet = new this.walletModel({
        userId: new Types.ObjectId(userId),
        mainBalance: 0,
        pendingBalance: 0,
        lockedBalance: 0,
      });
      await newWallet.save();
      return newWallet;
    }

    return wallet;
  }

  /**
   * Get wallet summary with recent transactions
   */
  async getWalletSummary(userId: string) {
    const wallet = await this.getWallet(userId);
    
    // Get recent transactions
    const recentTransactions = await this.transactionModel
      .find({ userId: new Types.ObjectId(userId) })
      .sort({ createdAt: -1 })
      .limit(5);

    // Get pending deposits/withdrawals count
    const pendingDeposits = await this.depositModel.countDocuments({
      userId: new Types.ObjectId(userId),
      status: TransactionStatus.PENDING,
    });

    const pendingWithdrawals = await this.withdrawalModel.countDocuments({
      userId: new Types.ObjectId(userId),
      status: TransactionStatus.PENDING,
    });

    return {
      success: true,
      wallet: {
        mainBalance: wallet.mainBalance,
        pendingBalance: wallet.pendingBalance,
        lockedBalance: wallet.lockedBalance,
        totalEarnings: wallet.totalEarnings,
        referralEarnings: wallet.referralEarnings,
        totalBalance: wallet.mainBalance + wallet.pendingBalance + wallet.lockedBalance,
      },
      recentTransactions,
      pendingDeposits,
      pendingWithdrawals,
    };
  }

  /**
   * Create deposit request
   */
  async createDeposit(
    userId: string,
    createDepositDto: CreateDepositDto,
    ipAddress?: string,
    userAgent?: string,
  ) {
    const { amount, paymentMethod, cryptoCurrency, userNote } = createDepositDto;

    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Generate deposit reference
    const depositRef = generateReference('DEP');

    // Generate deposit address for crypto
    let depositAddress = '';
    if (paymentMethod.startsWith('crypto_')) {
      depositAddress = this.generateDepositAddress(paymentMethod);
    }

    // Create deposit record
    const deposit = new this.depositModel({
      userId: new Types.ObjectId(userId),
      depositRef,
      amount,
      paymentMethod,
      depositAddress,
      cryptoCurrency,
      userNote,
      ipAddress,
      userAgent,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours expiry
    });

    await deposit.save();

    // Create transaction record
    const transaction = new this.transactionModel({
      userId: new Types.ObjectId(userId),
      transactionRef: generateReference('TXN'),
      type: TransactionType.DEPOSIT,
      status: TransactionStatus.PENDING,
      amount,
      paymentMethod,
      description: `Deposit via ${paymentMethod.replace('_', ' ')}`,
      ipAddress,
      userAgent,
    });

    await transaction.save();

    // Send email notification to user
    await this.emailService.sendDepositReceivedEmail(
      user.email,
      user.firstName,
      amount,
      'USD',
      depositRef,
      paymentMethod,
    );

    // Send admin notification
    await this.emailService.notifyAdminNewDeposit(
      user.email,
      `${user.firstName} ${user.lastName}`,
      amount,
      'USD',
      paymentMethod,
      depositRef,
    );

    // Return deposit instructions
    return {
      success: true,
      deposit: {
        id: deposit._id,
        depositRef: deposit.depositRef,
        amount: deposit.amount,
        paymentMethod: deposit.paymentMethod,
        status: deposit.status,
        expiresAt: deposit.expiresAt,
      },
      instructions: this.getDepositInstructions(paymentMethod, depositAddress, amount),
    };
  }

  /**
   * Get deposit instructions based on payment method
   */
  private getDepositInstructions(
    paymentMethod: PaymentMethod,
    depositAddress: string,
    amount: number,
  ) {
    const instructions: Record<PaymentMethod, any> = {
      [PaymentMethod.CRYPTO_BTC]: {
        type: 'crypto',
        currency: 'Bitcoin',
        address: depositAddress,
        network: 'Bitcoin Network',
        note: 'Send only BTC to this address. Minimum 3 confirmations required.',
      },
      [PaymentMethod.CRYPTO_ETH]: {
        type: 'crypto',
        currency: 'Ethereum',
        address: depositAddress,
        network: 'ERC-20',
        note: 'Send only ETH to this address. Minimum 12 confirmations required.',
      },
      [PaymentMethod.CRYPTO_USDT]: {
        type: 'crypto',
        currency: 'USDT',
        address: depositAddress,
        network: 'TRC-20 / ERC-20',
        note: 'Send only USDT to this address.',
      },
      [PaymentMethod.CRYPTO_USDC]: {
        type: 'crypto',
        currency: 'USDC',
        address: depositAddress,
        network: 'ERC-20',
        note: 'Send only USDC to this address.',
      },
      [PaymentMethod.BANK_TRANSFER]: {
        type: 'bank',
        bankName: 'Varlixo International Bank',
        accountNumber: '1234567890',
        accountName: 'Varlixo Holdings Ltd',
        routingNumber: '021000021',
        swiftCode: 'VARLIXXX',
        note: `Include your deposit reference in the transfer memo. Amount: $${amount}`,
      },
      [PaymentMethod.PAYPAL]: {
        type: 'paypal',
        email: 'payments@varlixo.com',
        note: 'Send as Friends & Family to avoid fees.',
      },
      [PaymentMethod.CARD]: {
        type: 'card',
        note: 'Card payments are processed through our secure payment gateway.',
      },
      [PaymentMethod.INTERNAL]: {
        type: 'internal',
        note: 'Internal transfer from another Varlixo account.',
      },
    };

    return instructions[paymentMethod] || { note: 'Contact support for instructions.' };
  }

  /**
   * Generate mock deposit address (in production, use payment processor)
   */
  private generateDepositAddress(paymentMethod: PaymentMethod): string {
    const prefixes: Record<string, string> = {
      crypto_btc: '1' + this.generateRandomString(33),
      crypto_eth: '0x' + this.generateRandomString(40),
      crypto_usdt: 'T' + this.generateRandomString(33),
      crypto_usdc: '0x' + this.generateRandomString(40),
    };
    return prefixes[paymentMethod] || '';
  }

  private generateRandomString(length: number): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
    return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  }

  /**
   * Upload deposit proof
   */
  async uploadDepositProof(
    userId: string,
    depositId: string,
    proofPath: string,
    referenceNumber?: string,
  ) {
    const deposit = await this.depositModel.findOne({
      _id: new Types.ObjectId(depositId),
      userId: new Types.ObjectId(userId),
    });

    if (!deposit) {
      throw new NotFoundException('Deposit not found');
    }

    if (deposit.status !== TransactionStatus.PENDING) {
      throw new BadRequestException('Deposit already processed');
    }

    deposit.proofOfPayment = proofPath;
    deposit.referenceNumber = referenceNumber;
    deposit.status = TransactionStatus.PROCESSING;
    await deposit.save();

    return {
      success: true,
      message: 'Proof uploaded successfully. Your deposit is being processed.',
      deposit,
    };
  }

  /**
   * Get user deposits
   */
  async getDeposits(userId: string, paginationDto: PaginationDto) {
    const { page = 1, limit = 10, sortOrder = 'desc' } = paginationDto;
    const skip = (page - 1) * limit;

    const [deposits, total] = await Promise.all([
      this.depositModel
        .find({ userId: new Types.ObjectId(userId) })
        .sort({ createdAt: sortOrder === 'desc' ? -1 : 1 })
        .skip(skip)
        .limit(limit),
      this.depositModel.countDocuments({ userId: new Types.ObjectId(userId) }),
    ]);

    return createPaginatedResponse(deposits, total, page, limit);
  }

  /**
   * Create withdrawal request
   */
  async createWithdrawal(
    userId: string,
    createWithdrawalDto: CreateWithdrawalDto,
    ipAddress?: string,
    userAgent?: string,
  ) {
    const {
      amount,
      paymentMethod,
      walletAddress,
      network,
      bankName,
      accountNumber,
      accountName,
      routingNumber,
      swiftCode,
      iban,
      userNote,
      twoFactorCode,
    } = createWithdrawalDto;

    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check KYC status
    if (user.kycStatus !== KycStatus.APPROVED) {
      throw new ForbiddenException('KYC verification required for withdrawals');
    }

    // Verify 2FA if enabled
    if (user.twoFactorEnabled) {
      if (!twoFactorCode) {
        throw new BadRequestException('Two-factor authentication code required');
      }

      const isValid = speakeasy.totp.verify({
        secret: user.twoFactorSecret,
        encoding: 'base32',
        token: twoFactorCode,
      });

      if (!isValid) {
        throw new BadRequestException('Invalid 2FA code');
      }
    }

    // Get wallet and check balance
    const wallet = await this.getWallet(userId);
    
    // Calculate fee (2% for crypto, 1% for bank)
    const feePercent = paymentMethod.startsWith('crypto_') ? 2 : 1;
    const fee = roundTo((amount * feePercent) / 100, 2);
    const netAmount = roundTo(amount - fee, 2);

    if (wallet.mainBalance < amount) {
      throw new BadRequestException('Insufficient balance');
    }

    // Generate withdrawal reference
    const withdrawalRef = generateReference('WTH');

    // Create withdrawal record
    const withdrawal = new this.withdrawalModel({
      userId: new Types.ObjectId(userId),
      withdrawalRef,
      amount,
      fee,
      netAmount,
      paymentMethod,
      walletAddress,
      network,
      bankName,
      accountNumber,
      accountName,
      routingNumber,
      swiftCode,
      iban,
      userNote,
      ipAddress,
      userAgent,
      balanceAtRequest: wallet.mainBalance,
      twoFactorVerified: user.twoFactorEnabled,
    });

    await withdrawal.save();

    // Lock the withdrawal amount
    wallet.mainBalance -= amount;
    wallet.pendingBalance += amount;
    await wallet.save();

    // Create transaction record
    const transaction = new this.transactionModel({
      userId: new Types.ObjectId(userId),
      transactionRef: generateReference('TXN'),
      type: TransactionType.WITHDRAWAL,
      status: TransactionStatus.PENDING,
      amount,
      fee,
      netAmount,
      paymentMethod,
      description: `Withdrawal via ${paymentMethod.replace('_', ' ')}`,
      balanceBefore: wallet.mainBalance + amount,
      balanceAfter: wallet.mainBalance,
      ipAddress,
      userAgent,
    });

    await transaction.save();

    // Send notification email to user
    await this.emailService.sendWithdrawalRequestEmail(
      user.email,
      user.firstName,
      amount,
      'USD',
    );

    // Send admin notification
    await this.emailService.notifyAdminNewWithdrawal(
      user.email,
      `${user.firstName} ${user.lastName}`,
      amount,
      'USD',
      paymentMethod,
      withdrawalRef,
    );

    return {
      success: true,
      message: 'Withdrawal request submitted successfully. Processing takes 24-48 hours.',
      withdrawal: {
        id: withdrawal._id,
        withdrawalRef: withdrawal.withdrawalRef,
        amount: withdrawal.amount,
        fee: withdrawal.fee,
        netAmount: withdrawal.netAmount,
        paymentMethod: withdrawal.paymentMethod,
        status: withdrawal.status,
      },
    };
  }

  /**
   * Get user withdrawals
   */
  async getWithdrawals(userId: string, paginationDto: PaginationDto) {
    const { page = 1, limit = 10, sortOrder = 'desc' } = paginationDto;
    const skip = (page - 1) * limit;

    const [withdrawals, total] = await Promise.all([
      this.withdrawalModel
        .find({ userId: new Types.ObjectId(userId) })
        .sort({ createdAt: sortOrder === 'desc' ? -1 : 1 })
        .skip(skip)
        .limit(limit),
      this.withdrawalModel.countDocuments({ userId: new Types.ObjectId(userId) }),
    ]);

    return createPaginatedResponse(withdrawals, total, page, limit);
  }

  /**
   * Get user transactions
   */
  async getTransactions(userId: string, paginationDto: PaginationDto) {
    const { page = 1, limit = 10, sortOrder = 'desc', search } = paginationDto;
    const skip = (page - 1) * limit;

    const query: any = { userId: new Types.ObjectId(userId) };
    
    if (search) {
      query.$or = [
        { transactionRef: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const [transactions, total] = await Promise.all([
      this.transactionModel
        .find(query)
        .sort({ createdAt: sortOrder === 'desc' ? -1 : 1 })
        .skip(skip)
        .limit(limit),
      this.transactionModel.countDocuments(query),
    ]);

    return createPaginatedResponse(transactions, total, page, limit);
  }

  /**
   * Cancel pending withdrawal
   */
  async cancelWithdrawal(userId: string, withdrawalId: string) {
    const withdrawal = await this.withdrawalModel.findOne({
      _id: new Types.ObjectId(withdrawalId),
      userId: new Types.ObjectId(userId),
      status: TransactionStatus.PENDING,
    });

    if (!withdrawal) {
      throw new NotFoundException('Withdrawal not found or already processed');
    }

    // Refund to main balance
    const wallet = await this.getWallet(userId);
    wallet.pendingBalance -= withdrawal.amount;
    wallet.mainBalance += withdrawal.amount;
    await wallet.save();

    // Update withdrawal status
    withdrawal.status = TransactionStatus.CANCELLED;
    await withdrawal.save();

    // Create refund transaction
    await this.transactionModel.create({
      userId: new Types.ObjectId(userId),
      transactionRef: generateReference('TXN'),
      type: TransactionType.REFUND,
      status: TransactionStatus.COMPLETED,
      amount: withdrawal.amount,
      description: `Withdrawal cancelled - ${withdrawal.withdrawalRef}`,
      balanceBefore: wallet.mainBalance - withdrawal.amount,
      balanceAfter: wallet.mainBalance,
    });

    return { 
      success: true,
      message: 'Withdrawal cancelled successfully. Funds have been returned to your account.' 
    };
  }
}
