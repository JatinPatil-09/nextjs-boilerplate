# Security Setup with Opengrep

This document explains how to set up and use Opengrep for configuration security in your Next.js API boilerplate. The system automatically detects exposed environment variables and prevents insecure commits.

## Quick Start Guide

### 1. Initial Setup (One-Time)

```bash
# Clone the repository and navigate to project
cd nextjs-boilerplate

# Install dependencies
npm install

# Run the automated security setup
npm run security:setup
# or
./scripts/setup-security.sh
```

**What this does:**

- Installs Opengrep static analysis tool
- Sets up security configuration (`.opengrep/config-security.yaml`)
- Installs git pre-commit hooks
- Runs initial security scan
- Configures npm scripts for easy access

### 2. Verify Installation

```bash
# Test security check manually
npm run security:check

# Should show: "SUCCESS: No security issues detected!"
```

### 3. Test the Protection

Create a test file with security issues:

```typescript
// test-bad.ts
const apiKey = "sk_live_dangerous123"; // ❌ Hardcoded secret
const dbUrl = process.env.DATABASE_URL; // ❌ Direct env access
```

Try to commit:

```bash
git add test-bad.ts
git commit -m "test"
# Should be BLOCKED with detailed security warnings
```

Remove the test file:

```bash
rm test-bad.ts
```

## Daily Workflow

### Before Every Commit

The security system runs **automatically** when you commit, but you can also run it manually:

```bash
# Run security check manually (recommended before committing)
npm run security:check

# Fix any issues, then commit
git add .
git commit -m "your changes"
```

### What Happens During Commit

1. **Pre-commit hook triggers** automatically
2. **Security scan runs** on your staged files
3. **If issues found**: Commit is **BLOCKED** with detailed error report
4. **If clean**: Commit proceeds normally

Example blocked commit:

```
Running security checks...

❌ Found 3 security issue(s):

📍 File: src/components/ApiDemo.tsx
📏 Line: 12
🚨 Issue: Direct process.env usage detected. Use @/env or @/lib/config instead
📋 Rule: opengrep.direct-process-env
──────────────────────────────────────────────────

📍 File: src/lib/payment.ts
📏 Line: 5
🚨 Issue: Hardcoded secret detected. Use environment variables instead
📋 Rule: opengrep.hardcoded-secrets
──────────────────────────────────────────────────

💡 Quick fixes:
1. Use import { env } from "@/env" for environment variables
2. Use import { clientConfig, getServerConfig } from "@/lib/config"
3. Move hardcoded secrets to .env files
4. Ensure client variables have NEXT_PUBLIC_ prefix

❌ ERROR: Commit rejected due to security issues!
Fix the security issues above and try again.
```

## Best Practices: Environment Variables

### ✅ Correct Patterns

#### 1. Define Environment Variables in `env.ts`

```typescript
// src/env.ts
export const env = createEnv({
  server: {
    // Server-only variables
    DATABASE_URL: z.string().url(),
    NEXTAUTH_SECRET: z.string().min(32),
    STRIPE_SECRET_KEY: z.string().startsWith("sk_").optional(),
    API_SECRET_KEY: z.string().min(16),
  },
  client: {
    // Client-safe variables (NEXT_PUBLIC_ prefix)
    NEXT_PUBLIC_API_BASE_URL: z.string().url(),
    NEXT_PUBLIC_APP_NAME: z.string().default("NextJS Boilerplate"),
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().startsWith("pk_").optional(),
  },
  runtimeEnv: {
    // Map to actual process.env (only allowed here)
    DATABASE_URL: process.env.DATABASE_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
    // ... other mappings
  },
});
```

#### 2. Use Configuration in `config.ts`

```typescript
// src/lib/config.ts
import { env } from "@/env";

// Client-side configuration (safe for client components)
export const clientConfig = {
  app: {
    name: env.NEXT_PUBLIC_APP_NAME,
    environment: env.NEXT_PUBLIC_APP_ENV,
  },
  api: {
    baseUrl: env.NEXT_PUBLIC_API_BASE_URL,
  },
  payments: {
    stripe: {
      publishableKey: env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    },
  },
};

// Server-side configuration (only for server components/API routes)
export const getServerConfig = () => ({
  app: {
    name: env.NEXT_PUBLIC_APP_NAME,
    isProduction: env.NODE_ENV === "production",
  },
  database: {
    url: env.DATABASE_URL, // ✅ Server-only
  },
  auth: {
    secret: env.NEXTAUTH_SECRET, // ✅ Server-only
  },
  payments: {
    stripe: {
      secretKey: env.STRIPE_SECRET_KEY, // ✅ Server-only
      publishableKey: env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    },
  },
});
```

#### 3. Use in Components

```typescript
// ✅ Client Component
"use client";
import { clientConfig } from "@/lib/config";

export function ClientComponent() {
  const apiUrl = clientConfig.api.baseUrl;     // ✅ Safe
  const appName = clientConfig.app.name;       // ✅ Safe

  return <div>API: {apiUrl}</div>;
}

// ✅ Server Component
import { getServerConfig } from "@/lib/config";

export function ServerComponent() {
  const config = getServerConfig();
  const dbUrl = config.database.url;           // ✅ Server-only
  const jwtSecret = config.auth.secret;        // ✅ Server-only

  return <div>Environment: {config.app.environment}</div>;
}

// ✅ API Route
import { getServerConfig } from "@/lib/config";

export async function POST() {
  const config = getServerConfig();
  const apiKey = config.payments.stripe.secretKey; // ✅ Server-only

  // Use apiKey safely...
}
```

#### 4. Use in API Services

```typescript
// ✅ API Service Configuration
import { clientConfig } from "@/lib/config";

class PostsService extends BaseApiFactory {
  private static getDefaultConfig(): ApiServiceConfig {
    return {
      baseUrl: clientConfig.api.jsonPlaceholder.baseUrl, // ✅ Safe
      timeout: 12000,
      defaultHeaders: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
  }

  static withBearerToken(token: string): PostsService {
    const config = this.getDefaultConfig();
    return new PostsService({
      ...config,
      authStrategy: AuthStrategyFactory.createBearerToken(token),
    });
  }
}
```

### ❌ Patterns That Will Be Blocked

#### 1. Direct `process.env` Usage

```typescript
// ❌ BLOCKED - Direct process.env access
const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
const dbUrl = process.env.DATABASE_URL;
const stripeKey = process.env.STRIPE_SECRET_KEY;

// ✅ FIXED - Use config modules
import { clientConfig, getServerConfig } from "@/lib/config";
const apiUrl = clientConfig.api.baseUrl;
const dbUrl = getServerConfig().database.url; // Server only
const stripeKey = getServerConfig().payments.stripe.secretKey; // Server only
```

#### 2. Hardcoded Secrets

```typescript
// ❌ BLOCKED - Hardcoded secrets
const stripeKey = "sk_live_abc123def456";
const jwtSecret = "my-super-secret-jwt-key";
const dbUrl = "postgresql://user:password@localhost:5432/mydb";

// ✅ FIXED - Use environment variables
import { env } from "@/env";
const stripeKey = env.STRIPE_SECRET_KEY;
const jwtSecret = env.NEXTAUTH_SECRET;
const dbUrl = env.DATABASE_URL;
```

#### 3. Server Variables in Client Components

```typescript
// ❌ BLOCKED - Server env in client component
"use client";
export function BadClientComponent() {
  const secret = process.env.NEXTAUTH_SECRET; // ❌ Server-only var
  const dbUrl = process.env.DATABASE_URL; // ❌ Server-only var
}

// ✅ FIXED - Use client-safe config
("use client");
import { clientConfig } from "@/lib/config";
export function GoodClientComponent() {
  const apiUrl = clientConfig.api.baseUrl; // ✅ Client-safe
  const appName = clientConfig.app.name; // ✅ Client-safe
}
```

#### 4. Hardcoded JWT Operations

```typescript
// ❌ BLOCKED - Hardcoded JWT secret
import jwt from "jsonwebtoken";
const token = jwt.sign(payload, "hardcoded-secret");

// ✅ FIXED - Use environment variable
import jwt from "jsonwebtoken";
import { getServerConfig } from "@/lib/config";
const token = jwt.sign(payload, getServerConfig().auth.secret);
```

## Environment File Structure

### Development Setup

```bash
# .env.local (for local development - not committed)
DATABASE_URL="postgresql://user:password@localhost:5432/myapp"
NEXTAUTH_SECRET="your-super-long-secret-key-here-min-32-chars"
NEXTAUTH_URL="http://localhost:3000"
API_SECRET_KEY="your-api-secret-key"
STRIPE_SECRET_KEY="sk_test_your_test_key"

# Public variables (safe to commit in .env.example)
NEXT_PUBLIC_API_BASE_URL="http://localhost:3000/api"
NEXT_PUBLIC_APP_NAME="NextJS Boilerplate"
NEXT_PUBLIC_APP_ENV="development"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_your_public_key"
```

### Production Deployment

```bash
# Set in your deployment platform (Vercel, Netlify, etc.)
DATABASE_URL="postgresql://prod-user:prod-pass@prod-host:5432/prod-db"
NEXTAUTH_SECRET="your-production-secret-64-chars-long"
NEXTAUTH_URL="https://yourapp.com"
STRIPE_SECRET_KEY="sk_live_your_production_key"

NEXT_PUBLIC_API_BASE_URL="https://yourapp.com/api"
NEXT_PUBLIC_APP_ENV="production"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_your_production_key"
```

## Manual Commands

```bash
# Run security check
npm run security:check

# Setup security (one-time)
npm run security:setup

# Scan specific directory
opengrep scan --config=.opengrep/config-security.yaml src/lib/

# Generate detailed JSON report
opengrep scan --config=.opengrep/config-security.yaml --json-output src/ > security-report.json

# Install git hooks manually
./scripts/install-git-hooks.sh
```

## Security Rules Reference

### Rules That Protect You

1. **`opengrep.direct-process-env`**: Blocks direct `process.env` usage outside `env.ts`
2. **`opengrep.hardcoded-secrets`**: Catches hardcoded API keys, tokens, passwords
3. **`opengrep.hardcoded-database-url`**: Prevents database URLs in code
4. **`opengrep.console-log-secrets`**: Warns about logging sensitive data
5. **`opengrep.server-env-in-client`**: Blocks server env vars in client components
6. **`opengrep.hardcoded-jwt-secret`**: Catches hardcoded JWT secrets
7. **`opengrep.hardcoded-stripe-keys`**: Prevents exposed Stripe keys

### Example Security Violations

```typescript
// ❌ All of these will be BLOCKED:

// Rule 1: Direct process.env
const url = process.env.API_URL;

// Rule 2: Hardcoded secrets
const key = "sk_live_dangerous123";

// Rule 3: Database URL
const db = "postgresql://user:pass@host/db";

// Rule 4: Logging secrets
console.log("API Key:", secretKey);

// Rule 5: Server env in client (with "use client")
const secret = process.env.NEXTAUTH_SECRET;

// Rule 6: Hardcoded JWT
jwt.sign(data, "hardcoded-secret");

// Rule 7: Stripe keys
const stripe = "sk_live_real_key_123";
```

## Troubleshooting

### Security Check Fails

```bash
# Check if Opengrep is installed
opengrep --version

# Reinstall if needed
npm run security:setup

# Manual check with verbose output
./scripts/security-check.sh --verbose
```

### False Positives

If you encounter false positives, you can:

1. **Update the rules** in `.opengrep/config-security.yaml`
2. **Exclude specific files** by adding them to the `exclude` list
3. **Report the issue** to improve the rules

### Bypass (Emergency Only)

```bash
# ⚠️ NOT RECOMMENDED - Only for emergencies
git commit --no-verify -m "emergency fix"
```

## CI/CD Integration

### GitHub Actions

```yaml
# .github/workflows/security.yml
name: Security Check
on: [push, pull_request]

jobs:
  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "18"
          cache: "npm"
      - run: npm ci
      - run: npm run security:setup
      - run: npm run security:check
```

This security setup ensures your Next.js API boilerplate follows security best practices and prevents accidental exposure of sensitive information through automated pre-commit checks.
