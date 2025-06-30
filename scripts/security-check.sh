#!/bin/bash

# Security Check Script for Next.js API Boilerplate
# This script runs Opengrep to detect exposed environment variables and secrets

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
CONFIG_FILE=".opengrep/config-security.yaml"
OUTPUT_FILE=".opengrep/security-report.json"
EXIT_ON_FINDINGS=${EXIT_ON_FINDINGS:-1}

echo -e "${BLUE}Running Security Check with Opengrep...${NC}"

# Check if Opengrep is installed
if ! command -v opengrep &> /dev/null; then
    echo -e "${RED}ERROR: Opengrep is not installed!${NC}"
    echo -e "${YELLOW}Install with: curl -fsSL https://raw.githubusercontent.com/opengrep/opengrep/main/install.sh | bash${NC}"
    exit 1
fi

# Check if config file exists
if [ ! -f "$CONFIG_FILE" ]; then
    echo -e "${RED}ERROR: Security config file not found: $CONFIG_FILE${NC}"
    exit 1
fi

# Create output directory if it doesn't exist
mkdir -p .opengrep

# Run Opengrep scan
echo -e "${BLUE}Scanning for environment variable exposures...${NC}"

# Run the scan and capture both stdout and the exit code
if opengrep scan \
    --config="$CONFIG_FILE" \
    --sarif-output="$OUTPUT_FILE" \
    --quiet \
    src/; then
    SCAN_EXIT_CODE=0
else
    SCAN_EXIT_CODE=$?
fi

# Check if any findings were reported
if [ -f "$OUTPUT_FILE" ]; then
    FINDINGS_COUNT=$(jq '.runs[0].results | length' "$OUTPUT_FILE" 2>/dev/null || echo "0")
else
    FINDINGS_COUNT=0
fi

echo ""
echo -e "${BLUE}Security Scan Results:${NC}"
echo "----------------------------------------"

if [ "$FINDINGS_COUNT" -eq 0 ]; then
    echo -e "${GREEN}SUCCESS: No security issues found!${NC}"
    echo -e "${GREEN}SUCCESS: All environment variables are properly configured.${NC}"
    exit 0
else
    echo -e "${RED}ERROR: Found $FINDINGS_COUNT security issue(s):${NC}"
    echo ""
    
    # Display findings in a readable format
    if [ -f "$OUTPUT_FILE" ]; then
        jq -r '.runs[0].results[] | 
            "File: \(.locations[0].physicalLocation.artifactLocation.uri)
            Line: \(.locations[0].physicalLocation.region.startLine)
            Issue: \(.message.text)
            Rule: \(.ruleId)
            " + ("─" * 50)' "$OUTPUT_FILE"
    fi
    
    echo ""
    echo -e "${YELLOW}Quick fixes:${NC}"
    echo "1. Move hardcoded secrets to environment variables"
    echo "2. Use @/env or @/lib/config instead of direct process.env access"
    echo "3. Ensure client-side variables have NEXT_PUBLIC_ prefix"
    echo "4. Check .env.example for proper variable naming"
    echo ""
    echo -e "${BLUE}Full report saved to: $OUTPUT_FILE${NC}"
    
    if [ "$EXIT_ON_FINDINGS" -eq 1 ]; then
        echo -e "${RED}BLOCKED: Commit blocked due to security issues!${NC}"
        exit 1
    else
        echo -e "${YELLOW}WARNING: Security issues detected but not blocking.${NC}"
        exit 0
    fi
fi 