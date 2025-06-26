# Next.js Strict TypeScript Boilerplate

A comprehensive Next.js boilerplate with strict TypeScript configuration, code quality enforcement, and pre-commit hooks.

## ✨ Features

- 🔵 **Strict TypeScript**: No `any` types allowed, comprehensive type checking
- 🧹 **Code Quality**: ESLint + Prettier with strict rules
- 🪝 **Pre-commit Hooks**: Quality checks before every commit and push
- 📁 **Absolute Imports**: Clean import structure with path mapping
- ⚡ **Fast Development**: Next.js 15 with Turbopack
- 🎨 **Tailwind CSS**: Pre-configured for styling

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run quality checks
npm run quality:check
```

## 📋 Available Scripts

```bash
# Development
npm run dev              # Start development server with Turbopack
npm run build           # Build for production
npm run start           # Start production server

# Code Quality
npm run lint            # Run ESLint
npm run lint:fix        # Run ESLint with auto-fix
npm run format          # Format code with Prettier
npm run format:check    # Check if code is formatted
npm run type-check      # Run TypeScript type checking
npm run quality:check   # Run all quality checks (type-check + lint + format)
```

## 🔧 Configuration

### TypeScript Configuration

The boilerplate uses strict TypeScript settings:

- `strict: true` - Enable all strict type checking options
- `noImplicitAny: false` (via allowJs: false) - No implicit any types
- `noUncheckedIndexedAccess: true` - Stricter array/object access
- `exactOptionalPropertyTypes: true` - Exact optional property types

### ESLint Rules

Key ESLint rules enforced:

- `@typescript-eslint/no-explicit-any: "error"` - Prevents any usage
- `@typescript-eslint/prefer-nullish-coalescing: "error"` - Use ?? instead of ||
- `@typescript-eslint/prefer-optional-chain: "error"` - Use optional chaining
- `@typescript-eslint/consistent-type-imports: "error"` - Use type imports

### Absolute Imports

Configured path mappings:

```typescript
{
  "@/*": ["./src/*"],
  "@/components/*": ["./src/components/*"],
  "@/lib/*": ["./src/lib/*"],
  "@/utils/*": ["./src/utils/*"],
  "@/types/*": ["./src/types/*"],
  "@/hooks/*": ["./src/hooks/*"],
  "@/app/*": ["./src/app/*"],
  "@/styles/*": ["./src/styles/*"],
  "@/constants/*": ["./src/constants/*"]
}
```

## 🔒 Quality Enforcement

### Pre-commit Hooks

Every commit runs:

- Lint-staged for formatting and linting staged files
- TypeScript type checking

### Pre-push Hooks

Every push runs:

- Full TypeScript type checking
- Complete ESLint check
- Prettier format verification
- Production build test

### Manual Quality Check

Run all quality checks manually:

```bash
npm run quality:check
```

This command will:

1. ✅ Check TypeScript types
2. ✅ Run ESLint
3. ✅ Verify Prettier formatting

## 📁 Project Structure

```
src/
├── app/                 # Next.js app directory
│   ├── layout.tsx      # Root layout component
│   ├── page.tsx        # Home page component
│   └── globals.css     # Global styles
├── components/         # Reusable UI components
├── lib/               # Library functions
├── utils/             # Utility functions
├── types/             # TypeScript type definitions
├── hooks/             # Custom React hooks
├── constants/         # Application constants
└── styles/            # Additional stylesheets
```

## 🛠️ Development Guidelines

### TypeScript Best Practices

1. **Never use `any`** - The ESLint configuration prevents this
2. **Use type imports** - `import type { Type } from 'module'`
3. **Define interfaces** - Use interfaces over types for object shapes
4. **Use strict null checks** - Handle null/undefined explicitly

### Import Guidelines

```typescript
// ✅ Good - Use absolute imports
import type { User } from "@/types";
import { Button } from "@/components/Button";
import { api } from "@/lib/api";

// ❌ Bad - Relative imports
import type { User } from "../../types";
import { Button } from "../components/Button";
```

### Component Guidelines

```typescript
// ✅ Good - Proper typing
interface ComponentProps {
  readonly title: string;
  readonly children?: React.ReactNode;
}

export default function Component({ title, children }: ComponentProps): React.JSX.Element {
  return <div>{title}{children}</div>;
}

// ❌ Bad - Missing types
export default function Component({ title, children }) {
  return <div>{title}{children}</div>;
}
```

## 🤝 Contributing

1. All code must pass `npm run quality:check`
2. Follow the established TypeScript patterns
3. Use absolute imports consistently
4. Add proper type definitions

## 📝 License

MIT License - see LICENSE file for details.
