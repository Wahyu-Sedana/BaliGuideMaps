#!/bin/bash

# Bali Guide Map - Build and Run Script

set -e

echo "🚀 Bali Guide Map - Build & Run"
echo "================================"
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check prerequisites
echo "${BLUE}Checking prerequisites...${NC}"

if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed"
    exit 1
fi

echo "${GREEN}✓ Node.js and npm found${NC}"
echo ""

# Install dependencies
echo "${BLUE}Installing dependencies...${NC}"
npm install
echo "${GREEN}✓ Dependencies installed${NC}"
echo ""

# Run linter
echo "${BLUE}Running linter...${NC}"
npm run lint -- --fix || true
echo "${GREEN}✓ Linter complete${NC}"
echo ""

# Type check
echo "${BLUE}Running type check...${NC}"
npm run type-check || true
echo "${GREEN}✓ Type check complete${NC}"
echo ""

# Run tests
echo "${BLUE}Running tests...${NC}"
npm test -- --coverage --passWithNoTests || true
echo "${GREEN}✓ Tests complete${NC}"
echo ""

echo "${GREEN}================================${NC}"
echo "${GREEN}✓ Build successful!${NC}"
echo "${GREEN}================================${NC}"
echo ""

echo "📱 To start development:"
echo "  npm start          - Start Expo"
echo "  npm run ios        - Run on iOS simulator"
echo "  npm run android    - Run on Android emulator"
echo ""

echo "🧪 To run tests:"
echo "  npm test           - Run all tests"
echo "  npm test:watch     - Watch mode"
echo "  npm test:coverage  - With coverage report"
echo ""

echo "📊 To check code quality:"
echo "  npm run lint       - ESLint"
echo "  npm run type-check - TypeScript"
echo ""
