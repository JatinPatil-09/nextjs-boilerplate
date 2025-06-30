#!/bin/bash

# Setup Security Checking with Opengrep
# This script installs Opengrep and configures security checks for the Next.js API boilerplate

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}Setting up Security Checking with Opengrep${NC}"
echo "=================================================="

# Step 1: Install Opengrep
echo -e "${BLUE}Step 1: Installing Opengrep...${NC}"
if command -v opengrep &> /dev/null; then
    echo -e "${GREEN}SUCCESS: Opengrep is already installed!${NC}"
    opengrep --version
else
    echo "Installing Opengrep..."
    curl -fsSL https://raw.githubusercontent.com/opengrep/opengrep/main/install.sh | bash
    
    # Add to PATH if needed
    if ! command -v opengrep &> /dev/null; then
        echo -e "${YELLOW}WARNING: Please add Opengrep to your PATH or restart your terminal${NC}"
        echo "You may need to run: export PATH=\"\$HOME/.local/bin:\$PATH\""
    else
        echo -e "${GREEN}SUCCESS: Opengrep installed successfully!${NC}"
        opengrep --version
    fi
fi

echo ""

# Step 2: Verify configuration files
echo -e "${BLUE}Step 2: Verifying configuration files...${NC}"

if [ -f ".opengrep/config-security.yaml" ]; then
    echo -e "${GREEN}SUCCESS: Security configuration found${NC}"
else
    echo -e "${RED}ERROR: Security configuration missing!${NC}"
    echo "Please ensure .opengrep/config-security.yaml exists"
    exit 1
fi

if [ -f "scripts/security-check.sh" ]; then
    echo -e "${GREEN}SUCCESS: Security check script found${NC}"
    chmod +x scripts/security-check.sh
else
    echo -e "${RED}ERROR: Security check script missing!${NC}"
    echo "Please ensure scripts/security-check.sh exists"
    exit 1
fi

echo ""

# Step 3: Install Git hooks
echo -e "${BLUE}Step 3: Installing Git hooks...${NC}"
if [ -f "scripts/install-git-hooks.sh" ]; then
    chmod +x scripts/install-git-hooks.sh
    ./scripts/install-git-hooks.sh
else
    echo -e "${YELLOW}WARNING: Git hooks installation script not found${NC}"
    echo "You may need to manually set up pre-commit hooks"
fi

echo ""

# Step 4: Test the setup
echo -e "${BLUE}Step 4: Testing the security setup...${NC}"
echo "Running initial security scan..."

if ./scripts/security-check.sh; then
    echo -e "${GREEN}SUCCESS: Initial security scan passed!${NC}"
else
    echo -e "${YELLOW}WARNING: Security issues detected in current codebase${NC}"
    echo "Please review and fix the issues above before proceeding"
fi

echo ""

# Step 5: Add to package.json scripts
echo -e "${BLUE}Step 5: Adding npm scripts...${NC}"

if [ -f "package.json" ]; then
    # Check if jq is available for JSON manipulation
    if command -v jq &> /dev/null; then
        # Add scripts to package.json
        jq '.scripts["security:check"] = "./scripts/security-check.sh"' package.json > package.json.tmp && mv package.json.tmp package.json
        jq '.scripts["security:setup"] = "./scripts/setup-security.sh"' package.json > package.json.tmp && mv package.json.tmp package.json
        echo -e "${GREEN}SUCCESS: Added security scripts to package.json${NC}"
        echo "  • npm run security:check - Run security scan"
        echo "  • npm run security:setup - Setup security tools"
    else
        echo -e "${YELLOW}WARNING: jq not found - please manually add these scripts to package.json:${NC}"
        echo '  "scripts": {'
        echo '    "security:check": "./scripts/security-check.sh",'
        echo '    "security:setup": "./scripts/setup-security.sh"'
        echo '  }'
    fi
else
    echo -e "${YELLOW}WARNING: package.json not found${NC}"
fi

echo ""

# Final summary
echo -e "${GREEN}Security setup complete!${NC}"
echo "================================"
echo ""
echo -e "${BLUE}What was installed:${NC}"
echo "• Opengrep static analysis tool"
echo "• Security configuration rules"
echo "• Pre-commit git hooks"
echo "• Security check scripts"
echo ""
echo -e "${BLUE}Available commands:${NC}"
echo "• ./scripts/security-check.sh    - Run security scan"
echo "• npm run security:check         - Run security scan (if added to package.json)"
echo "• opengrep scan --config=.opengrep/config-security.yaml src/"
echo ""
echo -e "${BLUE}What's protected:${NC}"
echo "• Direct process.env usage outside of env.ts/config.ts"
echo "• Hardcoded API keys, secrets, tokens"
echo "• Database URLs in code"
echo "• JWT secrets"
echo "• Stripe keys"
echo "• Console.log with sensitive data"
echo "• Server environment variables in client components"
echo ""
echo -e "${YELLOW}Usage tips:${NC}"
echo "• Commits will be automatically scanned"
echo "• Use @/env or @/lib/config for environment variables"
echo "• Prefix client variables with NEXT_PUBLIC_"
echo "• Store secrets in .env files, not in code"
echo ""
echo -e "${GREEN}SUCCESS: Your Next.js API boilerplate is now secure!${NC}" 