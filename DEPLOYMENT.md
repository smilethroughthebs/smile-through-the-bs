# 🚀 Varlixo Deployment Guide

## Quick Deploy (Recommended)

### Frontend: Vercel (Free)
### Backend: Render (Free tier available)

---

## Step 1: Deploy Backend to Render

1. **Go to [render.com](https://render.com)** and create an account

2. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repo OR use "Deploy from a Git URL"

3. **Configure the Service**
   ```
   Name: varlixo-backend
   Region: Choose closest to your users
   Branch: main
   Root Directory: backend
   Runtime: Node
   Build Command: npm install && npm run build
   Start Command: npm run start:prod
   ```

4. **Add Environment Variables** (Settings → Environment):
   ```
   NODE_ENV=production
   PORT=5000
   
   # MongoDB Atlas (your connection string)
   MONGODB_URI=mongodb+srv://tomkeifermanagementgroup_db_user:dGVY5Sk407Hmuo1X@varlixo.8upxipu.mongodb.net/varlixo?retryWrites=true&w=majority
   
   # JWT Secrets (generate random strings)
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this-in-production
   
   # Email (Resend SMTP)
   SMTP_HOST=smtp.resend.com
   SMTP_PORT=587
   SMTP_USER=resend
   SMTP_PASS=re_VZbFRYdt_6UtDPSUzn5WUPhggY4yqdfyP
   EMAIL_FROM=Varlixo <onboarding@resend.dev>
   
   # Frontend URL (update after Vercel deploy)
   FRONTEND_URL=https://your-vercel-app.vercel.app
   
   # Admin
   ADMIN_EMAIL=admin@varlixo.com
   ```

5. **Deploy** - Click "Create Web Service"

6. **Copy the URL** (e.g., `https://varlixo-backend.onrender.com`)

---

## Step 2: Deploy Frontend to Vercel

1. **Go to [vercel.com](https://vercel.com)** and create an account

2. **Import Project**
   - Click "Add New" → "Project"
   - Import from GitHub OR upload directly

3. **Configure**
   ```
   Framework Preset: Next.js
   Root Directory: frontend
   Build Command: npm run build
   Output Directory: .next
   ```

4. **Add Environment Variable**:
   ```
   NEXT_PUBLIC_API_URL=https://your-render-backend-url.onrender.com/api/v1
   ```
   (Replace with your actual Render backend URL from Step 1)

5. **Deploy** - Click "Deploy"

---

## Step 3: Update Backend CORS

After getting your Vercel URL, update the `FRONTEND_URL` environment variable on Render:
```
FRONTEND_URL=https://your-app.vercel.app
```

---

## Step 4: Test Everything

1. Visit your Vercel URL
2. Register a new account
3. Log in and test the dashboard
4. Test admin panel at `/admin`

---

## Environment Variables Reference

### Backend (.env)
```env
# App
NODE_ENV=production
PORT=5000

# Database
MONGODB_URI=your-mongodb-atlas-connection-string

# JWT
JWT_SECRET=generate-a-long-random-string-here
JWT_REFRESH_SECRET=generate-another-long-random-string

# Email (Resend)
SMTP_HOST=smtp.resend.com
SMTP_PORT=587
SMTP_USER=resend
SMTP_PASS=your-resend-api-key

# CORS
FRONTEND_URL=https://your-frontend-url.vercel.app

# Admin
ADMIN_EMAIL=admin@yourdomain.com
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com/api/v1
```

---

## Troubleshooting

### Backend not starting on Render
- Check build logs for errors
- Ensure all environment variables are set
- Make sure MongoDB Atlas IP whitelist includes `0.0.0.0/0` for Render

### CORS errors
- Verify `FRONTEND_URL` on backend matches your Vercel URL exactly
- Check that the URL doesn't have a trailing slash

### Database connection issues
- Whitelist all IPs in MongoDB Atlas: `0.0.0.0/0`
- Check connection string is correct

### Emails not sending
- For production, verify your domain at resend.com/domains
- Check SMTP credentials are correct

---

## Custom Domain (Optional)

### Vercel
1. Go to Project Settings → Domains
2. Add your domain
3. Update DNS records as instructed

### Render
1. Go to Service Settings → Custom Domains
2. Add your domain
3. Update DNS records

---

## Security Checklist for Production

- [ ] Change all default passwords and secrets
- [ ] Use strong JWT secrets (64+ characters)
- [ ] Enable 2FA for admin accounts
- [ ] Set up SSL (automatic on Vercel/Render)
- [ ] Configure rate limiting
- [ ] Set up monitoring/logging
- [ ] Regular database backups

---

## Support

If you encounter issues, check:
1. Render logs: Dashboard → Service → Logs
2. Vercel logs: Dashboard → Deployments → Functions
3. Browser console for frontend errors

Good luck with your deployment! 🎉

