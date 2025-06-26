# Naming Conventions Guide

This document outlines the naming conventions used throughout the Next.js TypeScript project to ensure consistency and maintainability.

## 📁 **File and Folder Naming**

### Folders

- **kebab-case** for all folders

```
src/
├── components/
├── form-fields/
├── data-display/
├── user-management/
└── api-routes/
```

### Files

- **kebab-case** for non-component files
- **PascalCase** for React component files

```
✅ Good:
- api-client.ts
- user-utils.ts
- UserProfile.tsx
- ContactForm.tsx

❌ Bad:
- ApiClient.ts
- userUtils.ts
- userProfile.tsx
- contact_form.tsx
```

## ⚛️ **React Components**

### Component Names

- **PascalCase** for component names
- Descriptive and specific names

```typescript
✅ Good:
export function UserProfileCard() {}
export function ContactFormModal() {}
export function ProductImageGallery() {}

❌ Bad:
export function card() {}
export function Modal() {} // Too generic
export function userprofile() {}
```

### Component Files

- **PascalCase** for component file names
- Match the component name exactly

```
✅ Good:
UserProfileCard.tsx → export function UserProfileCard()
ContactForm.tsx → export function ContactForm()

❌ Bad:
userProfileCard.tsx
contact-form.tsx
```

### Component Props Interfaces

- **PascalCase** ending with "Props"

```typescript
✅ Good:
interface UserProfileCardProps {
  user: User;
  onEdit: () => void;
}

interface ContactFormProps {
  onSubmit: (data: FormData) => void;
}

❌ Bad:
interface userProfileCardProps {}
interface IContactFormProps {}
interface ContactFormPropsInterface {}
```

## 🔧 **Functions and Variables**

### Function Names

- **camelCase** for all functions
- Use verb + noun pattern

```typescript
✅ Good:
function getUserById(id: string) {}
function validateEmail(email: string) {}
function formatCurrency(amount: number) {}

❌ Bad:
function GetUser() {}
function validate_email() {}
function format_currency() {}
```

### Variable Names

- **camelCase** for variables
- Descriptive and meaningful names

```typescript
✅ Good:
const userId = "123";
const isAuthenticated = true;
const userProfileData = await fetchUser();

❌ Bad:
const user_id = "123";
const auth = true;
const data = await fetchUser();
```

### Boolean Variables

- Use **is**, **has**, **can**, **should** prefixes

```typescript
✅ Good:
const isLoading = false;
const hasPermission = true;
const canEdit = user.role === "admin";
const shouldShowModal = isAuthenticated && hasData;

❌ Bad:
const loading = false;
const permission = true;
const edit = true;
const modal = false;
```

## 🏪 **Constants**

### Constant Names

- **SCREAMING_SNAKE_CASE** for constants
- Group related constants in objects

```typescript
✅ Good:
const API_BASE_URL = "https://api.example.com";
const MAX_FILE_SIZE = 1024 * 1024 * 5; // 5MB
const DEFAULT_TIMEOUT = 30000;

const HTTP_STATUS = {
  OK: 200,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;

❌ Bad:
const apiBaseUrl = "https://api.example.com";
const maxFileSize = 5242880;
const default_timeout = 30000;
```

## 🪝 **Custom Hooks**

### Hook Names

- **camelCase** starting with "use"
- Descriptive of the hook's purpose

```typescript
✅ Good:
function useAuth() {}
function useLocalStorage() {}
function useDebounce() {}
function useApiQuery() {}

❌ Bad:
function Auth() {}
function localStorage() {}
function debounceHook() {}
function useHook() {}
```

### Hook Files

- **kebab-case** for hook files
- Match the hook name pattern

```
✅ Good:
use-auth.ts → export function useAuth()
use-local-storage.ts → export function useLocalStorage()

❌ Bad:
useAuth.ts
auth-hook.ts
```

## 📦 **TypeScript Types and Interfaces**

### Interface Names

- **PascalCase** for interfaces
- No "I" prefix

```typescript
✅ Good:
interface User {
  id: string;
  name: string;
}

interface ApiResponse<T> {
  data: T;
  success: boolean;
}

❌ Bad:
interface IUser {}
interface userInterface {}
interface user {}
```

### Type Names

- **PascalCase** for type aliases
- Use "Type" suffix for clarity when needed

```typescript
✅ Good:
type UserRole = "admin" | "user" | "guest";
type EventHandler = (event: Event) => void;
type DatabaseConfigType = {
  host: string;
  port: number;
};

❌ Bad:
type userRole = "admin" | "user";
type eventHandler = (event: Event) => void;
type dbConfig = {};
```

### Generic Type Parameters

- **Single uppercase letters** starting with T

```typescript
✅ Good:
interface ApiResponse<T> {
  data: T;
}

function createArray<T, U>(item1: T, item2: U): [T, U] {}

❌ Bad:
interface ApiResponse<Data> {}
function createArray<Item1, Item2>() {}
```

## 🗂️ **Import/Export Patterns**

### Named Exports

- Prefer named exports over default exports
- Use barrel exports for clean imports

```typescript
✅ Good:
// From barrel export
import { Button, Modal, Input } from "@/components";
import { formatDate, validateEmail } from "@/utils";

// Direct imports when needed
import { UserProfile } from "@/components/UserProfile";

❌ Bad:
import Button from "@/components/Button";
import Modal from "@/components/Modal";
import * as utils from "@/utils";
```

### Import Organization

- Group imports by type with blank lines

```typescript
✅ Good:
import { useState, useEffect } from "react";
import type { NextPage } from "next";

import { Button, Modal } from "@/components";
import { formatDate } from "@/utils";
import type { User } from "@/types";

import styles from "./HomePage.module.css";

❌ Bad:
import { useState, useEffect } from "react";
import { Button } from "@/components";
import type { NextPage } from "next";
import { formatDate } from "@/utils";
import type { User } from "@/types";
import { Modal } from "@/components";
```

## 🎨 **CSS and Styling**

### CSS Classes

- **kebab-case** for CSS class names
- BEM methodology when applicable

```css
✅ Good:
.user-profile {
}
.user-profile__avatar {
}
.user-profile__name--highlighted {
}

❌ Bad:
.userProfile {
}
.user_profile {
}
.UserProfile {
}
```

### CSS Modules

- **camelCase** when accessing in TypeScript

```typescript
✅ Good:
import styles from "./UserProfile.module.css";

<div className={styles.userProfile}>
  <img className={styles.avatar} />
</div>

❌ Bad:
<div className={styles["user-profile"]}>
```

## 🌍 **Environment Variables**

### Environment Variable Names

- **SCREAMING_SNAKE_CASE** for all environment variables
- Use descriptive prefixes

```bash
✅ Good:
NEXT_PUBLIC_API_BASE_URL=https://api.example.com
NEXT_PUBLIC_ANALYTICS_KEY=abc123
DATABASE_URL=postgresql://...
AUTH_SECRET=xyz789

❌ Bad:
apiUrl=https://api.example.com
ANALYTICS=abc123
db_url=postgresql://...
```

## 📋 **Summary Checklist**

### File Naming

- [ ] Folders: kebab-case
- [ ] Component files: PascalCase.tsx
- [ ] Non-component files: kebab-case.ts
- [ ] Hook files: use-hook-name.ts

### Code Naming

- [ ] Components: PascalCase
- [ ] Functions: camelCase (verb + noun)
- [ ] Variables: camelCase (descriptive)
- [ ] Constants: SCREAMING_SNAKE_CASE
- [ ] Interfaces: PascalCase (no "I" prefix)
- [ ] Types: PascalCase
- [ ] Hooks: camelCase starting with "use"

### Conventions

- [ ] Boolean variables: is/has/can/should prefix
- [ ] Props interfaces: ComponentNameProps
- [ ] Generic types: Single uppercase letters (T, U, V)
- [ ] CSS classes: kebab-case
- [ ] Environment variables: SCREAMING_SNAKE_CASE

## 🚀 **Tools for Enforcement**

These naming conventions are enforced by:

- **ESLint**: Catches naming violations
- **TypeScript**: Enforces interface and type naming
- **Prettier**: Formats code consistently
- **Pre-commit hooks**: Prevents bad naming from being committed

Remember: Consistency is key! When in doubt, follow the existing patterns in the codebase.
