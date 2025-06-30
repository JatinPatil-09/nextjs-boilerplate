# Security Setup with Opengrep

This document explains how to set up and use Opengrep for configuration security in your Next.js API boilerplate. The system automatically detects exposed environment variables and prevents insecure commits.

## Quick Setup

### 1. Install and Configure

```bash
# Run the automated setup script
./scripts/setup-security.sh
```

This script will:

- Install Opengrep
- Set up security configuration
- Install git pre-commit hooks
- Run initial security scan

### 2. Manual Installation (if needed)

```bash
# Install Opengrep
curl -fsSL https://raw.githubusercontent.com/opengrep/opengrep/main/install.sh | bash

# Install git hooks
./scripts/install-git-hooks.sh

# Run security check
./scripts/security-check.sh
```

## How It Works

### Pre-commit Protection

Every time you try to commit code, the system automatically:

1. **Scans your code** for security vulnerabilities
2. **Detects exposed environment variables** and secrets
3. **Blocks the commit** if issues are found
4. **Shows you exactly what needs to be fixed**

### What Gets Detected

The security rules catch these common issues:

```typescript
// BLOCKED - Direct process.env usage
const apiUrl = process.env.API_URL;

// ALLOWED - Using config module
import { clientConfig } from "@/lib/config";
const apiUrl = clientConfig.api.baseUrl;

// BLOCKED - Hardcoded secret
const apiKey = "sk_live_abc123def456";

// ALLOWED - Environment variable
const apiKey = env.STRIPE_SECRET_KEY;

// BLOCKED - Server env in client component
export function ClientComponent() {
  const secret = process.env.JWT_SECRET; // Server-only var
}

// ALLOWED - Client env with proper prefix
export function ClientComponent() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
}
```

## Security Rules

### 1. Direct Environment Access

**Rule**: `direct-env-access`
**Blocks**: `process.env.$VAR` outside of `env.ts` and `config.ts`

```typescript
// BLOCKED
const dbUrl = process.env.DATABASE_URL;

// FIXED
import { getServerConfig } from "@/lib/config";
const dbUrl = getServerConfig().database.url;
```

### 2. Hardcoded Secrets

**Rule**: `hardcoded-secrets`
**Blocks**: Hardcoded API keys, tokens, passwords

```typescript
// BLOCKED
const stripeKey = "sk_live_abc123";
const jwtSecret = "my-super-secret-key";

// FIXED
const stripeKey = env.STRIPE_SECRET_KEY;
const jwtSecret = env.JWT_SECRET;
```

### 3. Database URLs

**Rule**: `hardcoded-database-url`
**Blocks**: Database connection strings in code

```typescript
// ❌ BLOCKED
const db = "postgresql://user:pass@localhost/db";

// ✅ FIXED
const db = env.DATABASE_URL;
```

### 4. JWT Secrets

**Rule**: `exposed-jwt-secret`
**Blocks**: Hardcoded JWT secrets

```typescript
// ❌ BLOCKED
jwt.sign(payload, "hardcoded-secret");

// ✅ FIXED
jwt.sign(payload, env.JWT_SECRET);
```

### 5. Client-Side Environment Variables

**Rule**: `server-env-in-client`
**Blocks**: Server environment variables in client components

```typescript
// ❌ BLOCKED - In client component
const secret = process.env.DATABASE_URL;

// ✅ FIXED - Server component or proper client var
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
```

## Usage Examples

### Running Security Checks

```bash
# Manual security check
./scripts/security-check.sh

# Or with npm (if configured)
npm run security:check

# Scan specific directory
opengrep scan --config=.opengrep/config-security.yaml src/lib/api/

# Generate detailed report
opengrep scan --config=.opengrep/config-security.yaml --sarif-output=security-report.json src/
```

### Example Output

When security issues are found:

```
🔒 Running Security Check with Opengrep...
🔍 Scanning for environment variable exposures...

📊 Security Scan Results:
----------------------------------------
❌ Found 2 security issue(s):

📍 File: src/lib/api/posts/post-service.ts
📏 Line: 25
🚨 Issue: Direct environment variable access detected. Use @/env or @/lib/config instead
📋 Rule: direct-env-access
──────────────────────────────────────────────────

📍 File: src/components/ApiDemo.tsx
📏 Line: 12
🚨 Issue: Potential hardcoded secret detected
📋 Rule: hardcoded-secrets
──────────────────────────────────────────────────

💡 Quick fixes:
1. Move hardcoded secrets to environment variables
2. Use @/env or @/lib/config instead of direct process.env access
3. Ensure client-side variables have NEXT_PUBLIC_ prefix
4. Check .env.example for proper variable naming

🚫 Commit blocked due to security issues!
```

## Testing the Setup

### 1. Create a Test File

```typescript
// test-security.ts - This should be blocked
const apiKey = "sk_live_dangerous123";
const dbUrl = process.env.DATABASE_URL;
```

### 2. Try to Commit

```bash
git add test-security.ts
git commit -m "test security"
```

You should see the security check block the commit.

### 3. Fix the Issues

```typescript
// test-security.ts - This should pass
import { env } from "@/env";
import { getServerConfig } from "@/lib/config";

const apiKey = env.STRIPE_SECRET_KEY;
const dbUrl = getServerConfig().database.url;
```

## Bypassing Security Checks

**⚠️ NOT RECOMMENDED** - Only use in emergencies:

```bash
# Bypass pre-commit hook (dangerous!)
git commit --no-verify

# Disable security check temporarily
EXIT_ON_FINDINGS=0 ./scripts/security-check.sh
```

## Customizing Rules

### Add New Rules

Edit `.opengrep/config-security.yaml`:

```yaml
rules:
  # Your custom rule
  - id: custom-security-rule
    pattern: |
      dangerousFunction($PARAM)
    message: "Dangerous function usage detected"
    languages: [typescript, javascript]
    severity: ERROR
```

### Disable Specific Rules

```bash
# Scan without specific rule
opengrep scan --config=.opengrep/config-security.yaml --exclude-rule=direct-env-access src/
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
      - uses: actions/checkout@v3
      - name: Install Opengrep
        run: |
          curl -fsSL https://raw.githubusercontent.com/opengrep/opengrep/main/install.sh | bash
          echo "$HOME/.local/bin" >> $GITHUB_PATH
      - name: Run Security Check
        run: ./scripts/security-check.sh
```

### Pre-push Hook

```bash
# .git/hooks/pre-push
#!/bin/bash
echo "🔒 Running security check before push..."
if ! ./scripts/security-check.sh; then
    echo "❌ Push blocked due to security issues!"
    exit 1
fi
```

## Troubleshooting

### Common Issues

**Issue**: `opengrep: command not found`

```bash
# Solution: Add to PATH
export PATH="$HOME/.local/bin:$PATH"
# Add to your ~/.bashrc or ~/.zshrc
```

**Issue**: `jq: command not found`

```bash
# Install jq for JSON processing
sudo apt-get install jq  # Ubuntu/Debian
brew install jq          # macOS
```

**Issue**: False positives

```bash
# Review and adjust rules in .opengrep/config-security.yaml
# Or exclude specific files/patterns
```

### Getting Help

1. **Check configuration**: Ensure `.opengrep/config-security.yaml` exists
2. **Verify installation**: Run `opengrep --version`
3. **Test manually**: `./scripts/security-check.sh`
4. **Review rules**: Check the patterns in your security config

## Best Practices

### Environment Variables

```typescript
// ✅ DO: Use centralized configuration
import { env } from "@/env";
import { clientConfig, getServerConfig } from "@/lib/config";

// Client-side
const apiUrl = clientConfig.api.baseUrl;

// Server-side
const dbUrl = getServerConfig().database.url;

// ❌ DON'T: Direct process.env access
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const dbUrl = process.env.DATABASE_URL;
```

### API Services

```typescript
// ✅ DO: Use config builder
const config = ApiClient.createConfigBuilder()
  .setBaseUrl(clientConfig.api.baseUrl)
  .withBearerToken(token)
  .build();

// ❌ DON'T: Hardcode values
const config = {
  baseUrl: "https://api.example.com",
  authStrategy: new BearerTokenStrategy("hardcoded-token"),
};
```

### Secrets Management

```bash
# ✅ DO: Store in .env files
echo "STRIPE_SECRET_KEY=sk_live_..." >> .env.local

# ✅ DO: Use environment-specific files
.env.local          # Local development
.env.staging        # Staging environment
.env.production     # Production environment

# ❌ DON'T: Commit secrets to git
git add .env        # Never do this!
```

This security setup ensures your Next.js API boilerplate follows security best practices and prevents accidental exposure of sensitive information.
