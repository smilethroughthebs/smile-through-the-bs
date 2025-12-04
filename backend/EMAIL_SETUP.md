# 📧 Varlixo Email System Setup

## Overview

The Varlixo backend uses **Resend SMTP** for sending transactional emails. This document explains how to configure and test the email system.

## Environment Configuration

Create a `.env` file in the `backend` directory with the following email settings:

```env
# ==============================================
# EMAIL CONFIGURATION (Resend SMTP)
# ==============================================

SMTP_HOST=smtp.resend.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=resend
SMTP_PASS=re_VZbFRYdt_6UtDPSUzn5WUPhggY4yqdfyP
EMAIL_FROM=Varlixo <onboarding@resend.dev>
ADMIN_EMAIL=admin@varlixo.com
```

## Complete .env Template

```env
# ==============================================
# VARLIXO INVESTMENT PLATFORM - ENVIRONMENT CONFIG
# ==============================================

# Application
NODE_ENV=development
PORT=3001

# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/varlixo

# JWT Configuration
JWT_SECRET=varlixo-jwt-secret-key-2024-production
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=varlixo-refresh-token-secret-key-2024
JWT_REFRESH_EXPIRES_IN=30d

# 2FA Configuration
TWO_FA_APP_NAME=Varlixo

# Email Configuration (Resend SMTP)
SMTP_HOST=smtp.resend.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=resend
SMTP_PASS=re_VZbFRYdt_6UtDPSUzn5WUPhggY4yqdfyP
EMAIL_FROM=Varlixo <onboarding@resend.dev>
ADMIN_EMAIL=admin@varlixo.com

# File Upload
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=5242880

# Admin Configuration
ADMIN_SECRET_ROUTE=varlixo-admin-portal-2024
ADMIN_DEFAULT_EMAIL=admin@varlixo.com
ADMIN_DEFAULT_PASSWORD=Admin@123456

# Crypto API (CoinGecko)
COINGECKO_API_URL=https://api.coingecko.com/api/v3

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000

# Rate Limiting
RATE_LIMIT_TTL=60
RATE_LIMIT_MAX=100

# Session Configuration
SESSION_IDLE_TIMEOUT=1800000
```

## Email Types Supported

### Authentication Emails
- ✅ Email verification on signup
- ✅ Password reset link
- ✅ Password changed confirmation
- ✅ 2FA verification codes via email

### Transaction Emails
- ✅ Deposit received notification
- ✅ Deposit confirmed notification
- ✅ Withdrawal request confirmation
- ✅ Withdrawal completed notification
- ✅ Withdrawal rejected notification

### KYC Emails
- ✅ KYC submission confirmation
- ✅ KYC approved notification
- ✅ KYC rejected notification (with reason)

### Investment Emails
- ✅ Investment activated notification
- ✅ Investment matured notification
- ✅ Daily profit credited notification

### Admin Notifications
- ✅ New deposit alert
- ✅ New withdrawal request alert
- ✅ New KYC submission alert

### Security Emails
- ✅ Security alerts (suspicious login attempts)
- ✅ Account locked notification

## Testing Email Connection

Once the backend is running, you can test the SMTP connection:

```bash
# Using curl
curl http://localhost:3001/api/v1/email/test-connection \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

Expected response:
```json
{
  "success": true,
  "data": {
    "success": true,
    "message": "SMTP connection successful"
  }
}
```

## Email Templates

All emails use beautiful, dark-themed HTML templates that are:
- 📱 Mobile responsive
- 🎨 Branded with Varlixo colors
- 🔗 Include action buttons
- 📝 Include clear, concise messaging

### Template Features
- Dark mode design (#0a0a0f background)
- Gradient accents (#00d4aa primary color)
- Clear call-to-action buttons
- Responsive tables for transaction details
- Social media links in footer
- Unsubscribe/preferences link

## Error Handling

The email service includes robust error handling:

```typescript
// Example error handling in email service
try {
  await this.transporter.sendMail({...});
  return true;
} catch (error) {
  this.logger.error(`Failed to send email: ${error.message}`);
  return false; // Graceful failure - doesn't break the main operation
}
```

## Important Notes

1. **Resend Free Tier**: The free tier allows sending to your verified email addresses only. For production, verify your domain.

2. **From Address**: When using `onboarding@resend.dev`, emails will be sent from Resend's domain. For production, use your own verified domain.

3. **Rate Limits**: Resend has rate limits on the free tier. Monitor your usage in the Resend dashboard.

4. **Email Logging**: All email operations are logged to the console for debugging.

## Production Checklist

Before going to production:

- [ ] Verify your domain in Resend dashboard
- [ ] Update `EMAIL_FROM` to use your domain
- [ ] Set up email monitoring/alerts
- [ ] Configure email bounce handling
- [ ] Set up email analytics tracking
- [ ] Update social links in templates
- [ ] Test all email types with real addresses

## Support

If you encounter issues with email delivery:

1. Check the console logs for error messages
2. Verify SMTP credentials are correct
3. Ensure Resend account is active
4. Check rate limits in Resend dashboard
5. Verify recipient email addresses

---

*Email system configured and ready for Varlixo Investment Platform* 🚀



