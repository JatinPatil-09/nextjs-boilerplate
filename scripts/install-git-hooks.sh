#!/bin/bash

# Install Git Hooks for Security Checks
# This script sets up pre-commit hooks to prevent committing exposed environment variables

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}Installing Git Security Hooks...${NC}"

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    echo -e "${RED}ERROR: Not in a git repository!${NC}"
    echo "Please run this script from the root of your git repository."
    exit 1
fi

# Create hooks directory if it doesn't exist
mkdir -p .git/hooks

# Create the pre-commit hook
PRE_COMMIT_HOOK=".git/hooks/pre-commit"

cat > "$PRE_COMMIT_HOOK" << 'EOF'
#!/bin/bash

# Pre-commit hook to check for exposed environment variables
# This prevents commits that contain security vulnerabilities

echo "Running security checks before commit..."

# Run the security check script
if ! ./scripts/security-check.sh; then
    echo ""
    echo "ERROR: Commit rejected due to security issues!"
    echo ""
    echo "To fix:"
    echo "1. Review the security issues above"
    echo "2. Move any hardcoded secrets to environment variables"
    echo "3. Use proper configuration management (@/env or @/lib/config)"
    echo "4. Try committing again"
    echo ""
    echo "To bypass this check (NOT RECOMMENDED):"
    echo "git commit --no-verify"
    echo ""
    exit 1
fi

echo "SUCCESS: Security check passed!"
exit 0
EOF

# Make the hook executable
chmod +x "$PRE_COMMIT_HOOK"

# Create commit-msg hook for additional security
COMMIT_MSG_HOOK=".git/hooks/commit-msg"

cat > "$COMMIT_MSG_HOOK" << 'EOF'
#!/bin/bash

# Commit message hook to warn about potential secrets in commit messages
commit_msg_file=$1

# Check for potential secrets in commit message
if grep -iE "(password|secret|key|token|api[_-]?key)" "$commit_msg_file" > /dev/null; then
    echo "WARNING: Your commit message may contain sensitive information!"
    echo "Please review your commit message and ensure no secrets are exposed."
    echo ""
    echo "Continue? (y/N)"
    read -r response
    if [[ ! "$response" =~ ^[Yy]$ ]]; then
        echo "Commit aborted."
        exit 1
    fi
fi

exit 0
EOF

# Make the commit-msg hook executable
chmod +x "$COMMIT_MSG_HOOK"

# Make security-check.sh executable if it exists
if [ -f "scripts/security-check.sh" ]; then
    chmod +x scripts/security-check.sh
fi

echo -e "${GREEN}SUCCESS: Git hooks installed successfully!${NC}"
echo ""
echo -e "${BLUE}Installed hooks:${NC}"
echo "• pre-commit: Runs security checks before each commit"
echo "• commit-msg: Warns about potential secrets in commit messages"
echo ""
echo -e "${YELLOW}How it works:${NC}"
echo "• Every commit will be automatically scanned for security issues"
echo "• Commits with exposed environment variables will be blocked"
echo "• You'll get detailed feedback about what needs to be fixed"
echo ""
echo -e "${BLUE}Test it:${NC}"
echo "Try making a commit with 'const apiKey = \"sk_test_123\"' to see it in action!"
echo ""
echo -e "${YELLOW}WARNING: To bypass security checks (NOT RECOMMENDED):${NC}"
echo "git commit --no-verify" 