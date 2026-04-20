# Admin Redesign — Plan 1: Foundation

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Install and configure shadcn/ui, Recharts, next-themes; wire teal theme; replace Flowbite's ThemeModeScript with next-themes ThemeProvider.

**Architecture:** shadcn/ui init generates `src/components/ui/` and `src/lib/utils.ts`. CSS variables in `globals.css` are overridden for teal primary. `ThemeProvider` from next-themes is added to `AppProviders.tsx`. The `@/*` → `src/*` alias already exists in `tsconfig.json` so shadcn's default paths work immediately.

**Tech Stack:** shadcn/ui, Recharts, next-themes, Tailwind CSS v3, Next.js App Router

**Spec:** `docs/superpowers/specs/2026-04-19-admin-dashboard-redesign-design.md`

---

### Task 1: Install packages

**Files:**
- Modify: `package.json` (via npm)

- [ ] **Step 1: Install recharts and next-themes**

```bash
npm install recharts next-themes
```

Expected output: `added N packages` — no peer dependency errors.

- [ ] **Step 2: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: install recharts and next-themes"
```

---

### Task 2: Initialize shadcn/ui

**Files:**
- Create: `components.json`
- Create: `src/lib/utils.ts`
- Modify: `src/app/globals.css`
- Modify: `tailwind.config.js`

- [ ] **Step 1: Run shadcn init**

```bash
npx shadcn@latest init
```

Answer the interactive prompts exactly as follows:
```
Which style would you like to use? › Default
Which color would you like to use as the base color? › Slate
Where is your global CSS file? › src/app/globals.css
Would you like to use CSS variables for theming? › yes
Where is your tailwind.config.js located? › tailwind.config.js
Configure the import alias for components? › @/components
Configure the import alias for utils? › @/lib/utils
Are you using React Server Components? › yes
```

- [ ] **Step 2: Verify generated files exist**

```bash
ls src/lib/utils.ts components.json src/components/ui/ 2>/dev/null && echo "OK"
```

Expected: `OK`

- [ ] **Step 3: Install all required shadcn/ui components in one command**

```bash
npx shadcn@latest add button card table dialog sheet dropdown-menu badge avatar input select textarea separator skeleton tooltip breadcrumb scroll-area pagination checkbox label
```

Expected: Each component added to `src/components/ui/`.

- [ ] **Step 4: Verify components were added**

```bash
ls src/components/ui/ | sort
```

Expected output includes: `avatar.tsx badge.tsx breadcrumb.tsx button.tsx card.tsx checkbox.tsx dialog.tsx dropdown-menu.tsx input.tsx label.tsx pagination.tsx scroll-area.tsx select.tsx separator.tsx sheet.tsx skeleton.tsx table.tsx textarea.tsx tooltip.tsx`

- [ ] **Step 5: Commit**

```bash
git add components.json src/lib/ src/components/ui/ tailwind.config.js src/app/globals.css
git commit -m "chore: init shadcn/ui with slate base and install components"
```

---

### Task 3: Configure teal theme (CSS variables)

**Files:**
- Modify: `src/app/globals.css`
- Modify: `tailwind.config.js`

- [ ] **Step 1: Replace CSS variable values in globals.css**

After shadcn init, `globals.css` contains a `@layer base { :root { ... } .dark { ... } }` block. Replace the `--primary`, `--primary-foreground`, `--ring`, and `--accent` lines in both `:root` and `.dark` with the teal values below.

Open `src/app/globals.css` and find the `@layer base` block that shadcn added. Replace the entire `@layer base` section with:

```css
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 174 72% 40%;
    --primary-foreground: 0 0% 98%;
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 174 60% 92%;
    --accent-foreground: 174 72% 25%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 174 72% 40%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
    --primary: 174 72% 50%;
    --primary-foreground: 174 72% 5%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 174 60% 12%;
    --accent-foreground: 174 72% 80%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 174 72% 50%;
  }
}
```

- [ ] **Step 2: Update tailwind.config.js to add shadcn tokens and darkMode class**

Replace the contents of `tailwind.config.js` with:

```js
/** @type {import('tailwindcss').Config} */
const flowbite = require('flowbite-react/tailwind');

module.exports = {
  darkMode: ['class'],
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}', flowbite.content()],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      animation: {
        appear: 'appear 0.5s ease-in-out',
        fadeIn: 'fadeIn 0.5s ease-in-out',
      },
      keyframes: {
        appear: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [flowbite.plugin()],
  assumptions: {
    setPublicClassFields: false,
  },
};
```

- [ ] **Step 3: Commit**

```bash
git add src/app/globals.css tailwind.config.js
git commit -m "chore: configure teal CSS theme variables for shadcn/ui"
```

---

### Task 4: Replace ThemeModeScript with next-themes ThemeProvider

**Files:**
- Modify: `src/app/layout.tsx`
- Modify: `src/providers/AppProviders.tsx`

Both Flowbite and next-themes use the `dark` class on `<html>`. Removing `ThemeModeScript` and adding `ThemeProvider` (with `attribute="class"`) achieves the same flash-prevention behavior via next-themes' own inline script, and works for both Flowbite and shadcn/ui components.

- [ ] **Step 1: Update AppProviders.tsx to add ThemeProvider**

Replace the contents of `src/providers/AppProviders.tsx` with:

```tsx
'use client';

import { Flowbite } from 'flowbite-react';
import { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import { AppProgressBar } from 'next-nprogress-bar';
import { ThemeProvider } from 'next-themes';
import { ReactNode } from 'react';
import 'utils/intl';
import { ToastMessageProvider } from './ToastMessageContext';

interface AppProvidersProps {
  children: ReactNode | ReactNode[];
  session: Session | null | undefined;
}

const AppProviders: React.FC<AppProvidersProps> = ({ children, session }) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <Flowbite>
        <SessionProvider session={session}>
          <ToastMessageProvider>{children}</ToastMessageProvider>
          <AppProgressBar color="#14b8a6" height="4px" options={{ showSpinner: false }} />
        </SessionProvider>
      </Flowbite>
    </ThemeProvider>
  );
};

export default AppProviders;
```

Note: `ThemeProvider` wraps `Flowbite` so both share the same dark mode class. Progress bar color updated to teal (`#14b8a6` = teal-500).

- [ ] **Step 2: Remove ThemeModeScript from root layout**

In `src/app/layout.tsx`, remove the `ThemeModeScript` import and usage:

```tsx
// import { ThemeModeScript } from 'flowbite-react';   ← remove this line

const RootLayout = async ({ children }: { children: ReactNode }) => {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* ThemeModeScript removed — next-themes handles flash prevention */}
      </head>
      <body className="custom-scrollbar dark:bg-gray-800 dark:text-white">
        <AppProviders session={session}>{children}</AppProviders>
      </body>
    </html>
  );
};
```

Important: add `suppressHydrationWarning` to `<html>` — next-themes requires this to prevent hydration mismatch warnings.

- [ ] **Step 3: Verify app builds without errors**

```bash
npm run build 2>&1 | tail -20
```

Expected: `Route (app)` table shown, no TypeScript errors, no missing module errors.

- [ ] **Step 4: Commit**

```bash
git add src/app/layout.tsx src/providers/AppProviders.tsx
git commit -m "feat: replace Flowbite ThemeModeScript with next-themes ThemeProvider"
```

---

### Plan 1 Complete

Foundation is in place. Proceed to **Plan 2: Admin Shell**.

Verify the full test suite still passes before continuing:

```bash
npm run test 2>&1 | tail -20
```

Expected: all existing tests pass (no regressions from config changes).
