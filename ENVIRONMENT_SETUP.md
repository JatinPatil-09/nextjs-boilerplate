# Environment Variables Setup Guide

This guide explains how to set up environment variables for the Next.js TypeScript boilerplate with type-safe validation.

## 🚀 **Quick Setup**

1. **Create your local environment file:**

   ```bash
   cp .env.example .env.local
   ```

2. **Fill in the required values:**

   ```bash
   # At minimum, you need:
   NEXT_PUBLIC_API_BASE_URL="http://localhost:3000/api"
   ```

3. **For full features, configure all variables below.**

## 📋 **Required Environment Variables**

### **API Configuration**

```bash
# Base URL for API calls (REQUIRED)
NEXT_PUBLIC_API_BASE_URL="http://localhost:3000/api"

# Secret key for external API authentication (REQUIRED for production)
API_SECRET_KEY="your-super-secret-api-key-min-16-chars"
```

### **Database**

```bash
# PostgreSQL database connection URL (REQUIRED for production)
DATABASE_URL="postgresql://username:password@localhost:5432/database_name"
```

### **Authentication**

```bash
# NextAuth.js configuration (REQUIRED for authentication features)
NEXTAUTH_SECRET="your-nextauth-secret-must-be-at-least-32-characters-long"
NEXTAUTH_URL="http://localhost:3000"
```

## 🔧 **Optional Environment Variables**

### **Application Configuration**

```bash
NEXT_PUBLIC_APP_NAME="NextJS Boilerplate"
NEXT_PUBLIC_APP_VERSION="1.0.0"
NEXT_PUBLIC_APP_ENV="development"
```

### **Analytics & Monitoring**

```bash
# PostHog Analytics
NEXT_PUBLIC_POSTHOG_KEY="phc_your-posthog-project-api-key"
NEXT_PUBLIC_POSTHOG_HOST="https://app.posthog.com"
NEXT_PUBLIC_ENABLE_ANALYTICS="true"

# Google Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID="G-XXXXXXXXXX"

# Sentry Error Tracking
SENTRY_DSN="https://your-sentry-dsn@sentry.io/project-id"
NEXT_PUBLIC_ENABLE_ERROR_REPORTING="true"

# Logtail Log Aggregation
LOGTAIL_SOURCE_TOKEN="your-logtail-source-token"
```

### **Email Configuration**

```bash
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT="587"
EMAIL_SERVER_USER="your-email@gmail.com"
EMAIL_SERVER_PASSWORD="your-app-password"
EMAIL_FROM="noreply@yourapp.com"
```

### **Payment Processing**

```bash
# Stripe Keys
STRIPE_SECRET_KEY="sk_test_your-stripe-secret-key"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_your-stripe-publishable-key"
```

### **External Services**

```bash
# Mapbox
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN="pk.your-mapbox-access-token"

# CDN & File Storage
NEXT_PUBLIC_CDN_URL="https://cdn.yourapp.com"
NEXT_PUBLIC_UPLOAD_URL="https://uploads.yourapp.com"
```

### **Feature Flags**

```bash
NEXT_PUBLIC_MAINTENANCE_MODE="false"
```

### **Development & Debugging**

```bash
NODE_ENV="development"
# SKIP_ENV_VALIDATION="true"  # Uncomment for Docker builds
```

## 🌍 **Environment-Specific Setup**

### **Development (.env.local)**

```bash
NEXT_PUBLIC_API_BASE_URL="http://localhost:3000/api"
NEXT_PUBLIC_APP_ENV="development"
NODE_ENV="development"
NEXT_PUBLIC_ENABLE_ANALYTICS="false"
```

### **Staging (.env.staging)**

```bash
NEXT_PUBLIC_API_BASE_URL="https://staging-api.yourapp.com"
NEXT_PUBLIC_APP_ENV="staging"
NODE_ENV="production"
NEXT_PUBLIC_ENABLE_ANALYTICS="true"
```

### **Production (.env.production)**

```bash
NEXT_PUBLIC_API_BASE_URL="https://api.yourapp.com"
NEXT_PUBLIC_APP_ENV="production"
NODE_ENV="production"
NEXT_PUBLIC_ENABLE_ANALYTICS="true"
NEXT_PUBLIC_ENABLE_ERROR_REPORTING="true"
```

## 🔒 **Security Best Practices**

### **DO:**

- ✅ Use strong, randomly generated secrets (minimum 32 characters)
- ✅ Use different secrets for different environments
- ✅ Rotate secrets regularly
- ✅ Only use `NEXT_PUBLIC_` prefix for non-sensitive client-side variables
- ✅ Validate all environment variables at build time
- ✅ Store production secrets in secure vaults (Vercel, AWS Secrets Manager, etc.)

### **DON'T:**

- ❌ Never commit `.env.local` or `.env.production` to version control
- ❌ Don't use `NEXT_PUBLIC_` for sensitive data (API secrets, database URLs)
- ❌ Don't use the same secrets across environments
- ❌ Don't hardcode secrets in your code

## 🛠️ **Type-Safe Environment Access**

```typescript
// Import the validated environment
import { env } from "@/env.mjs";

// Type-safe access to environment variables
const apiUrl = env.NEXT_PUBLIC_API_BASE_URL; // ✅ Type-safe, validated
const dbUrl = env.DATABASE_URL; // ✅ Server-side only

// This will cause a TypeScript error:
// const invalid = env.NONEXISTENT_VAR;       // ❌ TypeScript error
```

## 📝 **Environment File Templates**

### **Create .env.local for development:**

```bash
# Copy and customize for local development
NEXT_PUBLIC_API_BASE_URL="http://localhost:3000/api"
NEXT_PUBLIC_APP_ENV="development"
NEXT_PUBLIC_ENABLE_ANALYTICS="false"
```

### **For production deployment:**

1. **Vercel:** Add environment variables in the Vercel dashboard
2. **Docker:** Use environment files or docker-compose
3. **Other platforms:** Follow platform-specific environment variable setup

## 🧪 **Testing Environment Variables**

```bash
# Test that environment variables are properly loaded
npm run build

# If validation fails, you'll see detailed error messages:
# ❌ Invalid environment variables:
# NEXT_PUBLIC_API_BASE_URL: Invalid url
# DATABASE_URL: Required
```

## 🚨 **Common Issues & Solutions**

### **Build Fails with Environment Validation Error**

```bash
# Issue: Missing required environment variables
# Solution: Add all required variables to your .env.local

NEXT_PUBLIC_API_BASE_URL="http://localhost:3000/api"
```

### **Client-side Variables Not Available**

```bash
# Issue: Forgot NEXT_PUBLIC_ prefix
# Solution: Add NEXT_PUBLIC_ prefix for client-side variables

# ❌ Wrong:
API_BASE_URL="http://localhost:3000/api"

# ✅ Correct:
NEXT_PUBLIC_API_BASE_URL="http://localhost:3000/api"
```

### **Skip Validation for Docker Builds**

```bash
# Add this to skip validation during Docker builds
SKIP_ENV_VALIDATION="true"
```

## 📚 **Additional Resources**

- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [@t3-oss/env-nextjs Documentation](https://env.t3.gg/)
- [Zod Schema Validation](https://zod.dev/)
- [Environment Variable Security](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)

## ✅ **Verification Checklist**

- [ ] Created `.env.local` with required variables
- [ ] Environment validation passes (`npm run build`)
- [ ] No sensitive data uses `NEXT_PUBLIC_` prefix
- [ ] Different secrets for different environments
- [ ] Environment variables are typed and validated
- [ ] Build and development work correctly
