/**
 * ==============================================
 * VARLIXO - HELPER UTILITIES
 * ==============================================
 * Common utility functions used across the application.
 */

import { v4 as uuidv4 } from 'uuid';

/**
 * Generate a unique reference ID with prefix
 * @param prefix - Prefix for the reference (e.g., 'TXN', 'DEP', 'WTH')
 */
export function generateReference(prefix: string): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = uuidv4().split('-')[0].toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}

/**
 * Generate a referral code
 * @param length - Length of the code
 */
export function generateReferralCode(length: number = 8): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

/**
 * Calculate percentage
 * @param amount - Base amount
 * @param percentage - Percentage to calculate
 */
export function calculatePercentage(amount: number, percentage: number): number {
  return (amount * percentage) / 100;
}

/**
 * Round to decimal places
 * @param value - Number to round
 * @param decimals - Number of decimal places
 */
export function roundTo(value: number, decimals: number = 2): number {
  return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
}

/**
 * Format currency
 * @param amount - Amount to format
 * @param currency - Currency code
 */
export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
}

/**
 * Generate a random OTP
 * @param length - Length of OTP
 */
export function generateOTP(length: number = 6): string {
  let otp = '';
  for (let i = 0; i < length; i++) {
    otp += Math.floor(Math.random() * 10);
  }
  return otp;
}

/**
 * Mask sensitive data
 * @param data - Data to mask
 * @param visibleChars - Number of visible characters at start and end
 */
export function maskData(data: string, visibleChars: number = 4): string {
  if (data.length <= visibleChars * 2) {
    return '*'.repeat(data.length);
  }
  const start = data.substring(0, visibleChars);
  const end = data.substring(data.length - visibleChars);
  const masked = '*'.repeat(data.length - visibleChars * 2);
  return `${start}${masked}${end}`;
}

/**
 * Validate email format
 * @param email - Email to validate
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Generate password reset token
 */
export function generateToken(): string {
  return uuidv4() + uuidv4();
}

/**
 * Check if date is expired
 * @param date - Date to check
 */
export function isExpired(date: Date): boolean {
  return new Date() > new Date(date);
}

/**
 * Add days to date
 * @param date - Base date
 * @param days - Number of days to add
 */
export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

/**
 * Get IP address from request
 * @param request - Express request object
 */
export function getClientIp(request: any): string {
  return (
    request.headers['x-forwarded-for']?.split(',')[0] ||
    request.connection?.remoteAddress ||
    request.socket?.remoteAddress ||
    'unknown'
  );
}



