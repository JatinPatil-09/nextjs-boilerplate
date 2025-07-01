# Next.js Boilerplate

A modern, batteries-included starter template for building production-ready applications with **Next.js 15**, **React 19**, and **TypeScript 5**.

This repository focuses on DX (developer experience) and best-practice defaults so you can start shipping features instead of wiring up tooling.

---

## ✨ Key Features

> Everything you need, nothing you don't.

- **⚡️ Instant DX** – Powered by Next 15 (Turbopack), React 19, and strict TypeScript.
- **🎨 Tailwind CSS 4** – Utility-first styling with sensible defaults & `tailwind-merge`.
- **🔒 Environment Safety** – Runtime & build-time env validation with `@t3-oss/env-nextjs`.
- **🗂️ Typed Config Layer** – Centralised `lib/config.ts` for server & client config.
- **🌍 Internationalisation (i18n)** – Locale-aware routing & translations via `next-intl`.
- **✅ Form Handling System** – Reusable `FormWrapper`, `FormField`, `MultiSelect`, Zod validation, and comprehensive docs in [`FORM_HANDLING.md`](./FORM_HANDLING.md).
- **📈 Analytics Ready** – PostHog integration with opt-in flag (`NEXT_PUBLIC_ENABLE_ANALYTICS`). See [`ANALYTICS_SETUP.md`](./ANALYTICS_SETUP.md).
- **🛡️ Security Scripts** – Automated dependency audit & secrets scanning (`npm run security:check`).
- **🧑‍💻 Code Quality** – ESLint 9 with opinionated rules, Prettier 3 (+ organise-imports), type-checking, and `lint-staged`.
- **🚦 Git Hooks** – Husky pre-commit (lint / type-check / security) & pre-push (`npm run build`).
- **📜 Conventional Commits** – Commitlint rules & changelog friendly.

---

## 📂 Project Structure (high-level)

```
src/
  app/            # App router (pages, layouts, api routes)
  components/     # Shared UI components
  constants/      # Reusable constants & design tokens
  lib/            # Core utilities (config, forms, api, i18n…)
  hooks/          # Reusable React hooks
  styles/         # Global CSS / Tailwind layers
  tests/          # e2e & integration tests
  public/         # Static assets
```

> Detailed module explanations live next to their code (look for `README.md` files or in-line docs).

---

## 🚀 Getting Started

### 1. Prerequisites

- **Node >= 20** (LTS recommended)
- **pnpm**, **npm**, or **yarn** – examples use `npm`

### 2. Clone & Install

```bash
# Clone
git clone https://github.com/your-org/nextjs-boilerplate.git
cd nextjs-boilerplate

# Install dependencies
npm install
```

### 3. Environment Variables

Copy `.env.example` → `.env.local` and fill in the required values. The schema is enforced at build-time & runtime, so missing / invalid vars will abort the build.

```bash
cp .env.example .env.local
```

### 4. Development Server

```bash
npm run dev
# ➜  http://localhost:3000
```

Turbopack provides instant HMR for a smooth DX.

### 5. Production Build

```bash
# Create an optimised build
npm run build

# Start the production server
npm start
```

> A pre-push Husky hook automatically runs `npm run build` to prevent pushing broken code.

---

## 🛠️ Common Scripts

| Script                   | Description                                   |
| ------------------------ | --------------------------------------------- |
| `npm run dev`            | Start dev server with Turbopack               |
| `npm run build`          | Generate production build                     |
| `npm start`              | Run the production server (after build)       |
| `npm run lint`           | Lint all code with ESLint                     |
| `npm run type-check`     | Run TypeScript in strict mode (no emit)       |
| `npm run quality:check`  | Lint + type-check + Prettier formatting check |
| `npm run format`         | Format all supported files with Prettier      |
| `npm run security:check` | Run security audit & secret scanning scripts  |

---

## 🧩 Extending Forms

The custom form system (`src/lib/forms`) provides reusable primitives:

- `FormWrapper` – sets up React-Hook-Form + Zod resolver
- `FormField` – smart inputs with validation & error handling
- `MultiSelect` – accessible multi-select component

See the [full documentation](./FORM_HANDLING.md) for examples, validation, dynamic fields, multi-step wizards, etc.

---

## 📈 Enabling Analytics

1. Obtain a PostHog project API key & host.
2. Set the following env vars in `.env.local`:

```
NEXT_PUBLIC_POSTHOG_KEY=phc_...
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
NEXT_PUBLIC_ENABLE_ANALYTICS=true
```

When `NEXT_PUBLIC_ENABLE_ANALYTICS` is `false`, PostHog is not initialised, avoiding unnecessary requests & hydration issues.

More details in [`ANALYTICS_SETUP.md`](./ANALYTICS_SETUP.md).

---

## 🤝 Contributing

1. Fork & clone the repo.
2. Create a new branch: `git checkout -b feat/awesome-feature`.
3. Commit using **Conventional Commits** (`npm run commit` if you use commitizen).
4. Push and open a Pull Request.

The CI (you can wire up GitHub Actions) should pass lint / type-check / build before merge.

---

## 📄 License

MIT © Jatin / DIT-GLOBAL
