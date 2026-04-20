# Admin Redesign — Plan 2: Admin Shell

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the new admin shell — sidebar with nav groups, slim top navbar, user dropdown, theme toggle, breadcrumb — and wire them into the admin layout.

**Architecture:** Five new components in `src/components/admin/layout/`. `AdminShell` composes all of them and replaces `AdminLayout` from `src/components/layouts/adminLayout/`. The admin `layout.tsx` is updated to use `AdminShell`. Old layout components are kept (non-admin pages still use them) but no longer referenced by admin routes.

**Tech Stack:** shadcn/ui (Button, DropdownMenu, Avatar, ScrollArea, Breadcrumb), next-themes, react-icons, Next.js `usePathname`

**Prerequisite:** Plan 1 complete.

---

### Task 1: ThemeToggle component

**Files:**
- Create: `src/components/admin/layout/ThemeToggle.tsx`
- Create: `src/components/admin/layout/ThemeToggle.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `src/components/admin/layout/ThemeToggle.test.tsx`:

```tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeToggle } from './ThemeToggle';

const mockSetTheme = vi.fn();
vi.mock('next-themes', () => ({
  useTheme: () => ({ theme: 'light', setTheme: mockSetTheme }),
}));

describe('ThemeToggle', () => {
  it('renders a toggle button', () => {
    render(<ThemeToggle />);
    expect(screen.getByRole('button', { name: /toggle theme/i })).toBeInTheDocument();
  });

  it('calls setTheme with dark when current theme is light', () => {
    render(<ThemeToggle />);
    fireEvent.click(screen.getByRole('button', { name: /toggle theme/i }));
    expect(mockSetTheme).toHaveBeenCalledWith('dark');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm run test -- ThemeToggle.test 2>&1 | tail -10
```

Expected: FAIL — `Cannot find module './ThemeToggle'`

- [ ] **Step 3: Create the component**

Create `src/components/admin/layout/ThemeToggle.tsx`:

```tsx
'use client';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Moon, Sun } from 'lucide-react';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      aria-label="Toggle theme"
    >
      <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    </Button>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npm run test -- ThemeToggle.test 2>&1 | tail -10
```

Expected: PASS — 2 tests passing.

- [ ] **Step 5: Commit**

```bash
git add src/components/admin/layout/ThemeToggle.tsx src/components/admin/layout/ThemeToggle.test.tsx
git commit -m "feat: add admin ThemeToggle component"
```

---

### Task 2: UserDropdown component

**Files:**
- Create: `src/components/admin/layout/UserDropdown.tsx`
- Create: `src/components/admin/layout/UserDropdown.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `src/components/admin/layout/UserDropdown.test.tsx`:

```tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { UserDropdown } from './UserDropdown';

const mockHandleLogout = vi.fn();

vi.mock('@hooks/useAuth', () => ({
  default: () => ({ handleLogout: mockHandleLogout }),
}));

vi.mock('@stores/useMeStore', () => ({
  useFullName: () => 'Jane Doe',
  useUser: () => ({ email: 'jane@example.com' }),
}));

// shadcn DropdownMenu uses Radix portals — render into document.body
vi.mock('@/components/ui/dropdown-menu', () => ({
  DropdownMenu: ({ children }: any) => <div>{children}</div>,
  DropdownMenuTrigger: ({ children }: any) => <div>{children}</div>,
  DropdownMenuContent: ({ children }: any) => <div data-testid="dropdown-content">{children}</div>,
  DropdownMenuItem: ({ children, onClick }: any) => <button onClick={onClick}>{children}</button>,
  DropdownMenuSeparator: () => <hr />,
}));

vi.mock('@/components/ui/avatar', () => ({
  Avatar: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  AvatarFallback: ({ children }: any) => <span data-testid="avatar-fallback">{children}</span>,
}));

describe('UserDropdown', () => {
  it('renders avatar with correct initials', () => {
    render(<UserDropdown />);
    expect(screen.getByTestId('avatar-fallback')).toHaveTextContent('JD');
  });

  it('shows user name and email', () => {
    render(<UserDropdown />);
    expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    expect(screen.getByText('jane@example.com')).toBeInTheDocument();
  });

  it('calls handleLogout when logout is clicked', () => {
    render(<UserDropdown />);
    fireEvent.click(screen.getByText('Logout'));
    expect(mockHandleLogout).toHaveBeenCalled();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm run test -- UserDropdown.test 2>&1 | tail -10
```

Expected: FAIL — `Cannot find module './UserDropdown'`

- [ ] **Step 3: Create the component**

Create `src/components/admin/layout/UserDropdown.tsx`:

```tsx
'use client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { LogOut, User } from 'lucide-react';
import useAuth from '@hooks/useAuth';
import { useFullName, useUser } from '@stores/useMeStore';

export function UserDropdown() {
  const { handleLogout } = useAuth();
  const fullName = useFullName();
  const user = useUser();

  const initials = fullName
    ? fullName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'A';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="flex items-center rounded-full focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          aria-label="User menu"
        >
          <Avatar className="h-8 w-8 cursor-pointer">
            <AvatarFallback className="bg-primary text-primary-foreground text-xs font-medium">
              {initials}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        {fullName && (
          <>
            <div className="px-2 py-1.5">
              <p className="text-sm font-medium">{fullName}</p>
              {user?.email && (
                <p className="text-xs text-muted-foreground">{user.email}</p>
              )}
            </div>
            <DropdownMenuSeparator />
          </>
        )}
        <DropdownMenuItem className="cursor-pointer gap-2" disabled>
          <User className="h-4 w-4" />
          Profile
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer gap-2 text-destructive focus:text-destructive"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npm run test -- UserDropdown.test 2>&1 | tail -10
```

Expected: PASS — 3 tests passing.

- [ ] **Step 5: Commit**

```bash
git add src/components/admin/layout/UserDropdown.tsx src/components/admin/layout/UserDropdown.test.tsx
git commit -m "feat: add admin UserDropdown component"
```

---

### Task 3: AdminSidebar component

**Files:**
- Create: `src/components/admin/layout/AdminSidebar.tsx`
- Create: `src/components/admin/layout/AdminSidebar.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `src/components/admin/layout/AdminSidebar.test.tsx`:

```tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AdminSidebar } from './AdminSidebar';

// usePathname already mocked in vitest.setup.tsx to return '/'
vi.mock('@/components/ui/scroll-area', () => ({
  ScrollArea: ({ children }: any) => <div>{children}</div>,
}));

describe('AdminSidebar', () => {
  const toggleSidebar = vi.fn();

  it('renders all nav group labels when expanded', () => {
    render(<AdminSidebar collapsed={false} toggleSidebar={toggleSidebar} />);
    expect(screen.getByText('Overview')).toBeInTheDocument();
    expect(screen.getByText('Content')).toBeInTheDocument();
    expect(screen.getByText('Management')).toBeInTheDocument();
    expect(screen.getByText('Media')).toBeInTheDocument();
    expect(screen.getByText('System')).toBeInTheDocument();
  });

  it('renders all nav item labels when expanded', () => {
    render(<AdminSidebar collapsed={false} toggleSidebar={toggleSidebar} />);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Grades')).toBeInTheDocument();
    expect(screen.getByText('Subjects')).toBeInTheDocument();
    expect(screen.getByText('Units')).toBeInTheDocument();
    expect(screen.getByText('Topics')).toBeInTheDocument();
    expect(screen.getByText('Users')).toBeInTheDocument();
    expect(screen.getByText('Institutions')).toBeInTheDocument();
    expect(screen.getByText('Media Content')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('hides group labels when collapsed', () => {
    render(<AdminSidebar collapsed={true} toggleSidebar={toggleSidebar} />);
    expect(screen.queryByText('Overview')).not.toBeInTheDocument();
    expect(screen.queryByText('Dashboard')).not.toBeInTheDocument();
  });

  it('calls toggleSidebar when collapse button is clicked', () => {
    render(<AdminSidebar collapsed={false} toggleSidebar={toggleSidebar} />);
    fireEvent.click(screen.getByRole('button', { name: /collapse/i }));
    expect(toggleSidebar).toHaveBeenCalled();
  });

  it('shows mobile overlay when not collapsed', () => {
    render(<AdminSidebar collapsed={false} toggleSidebar={toggleSidebar} />);
    const overlay = document.querySelector('[aria-hidden="true"]');
    expect(overlay).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm run test -- AdminSidebar.test 2>&1 | tail -10
```

Expected: FAIL — `Cannot find module './AdminSidebar'`

- [ ] **Step 3: Create the component**

Create `src/components/admin/layout/AdminSidebar.tsx`:

```tsx
'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  AiOutlineDashboard,
  AiOutlineUser,
  AiOutlineHdd,
  AiOutlineBook,
  AiOutlineBlock,
  AiOutlineBulb,
  AiOutlineContainer,
  AiOutlineSetting,
} from 'react-icons/ai';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

type NavItem = {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
};

type NavGroup = {
  label: string;
  items: NavItem[];
};

const NAV_GROUPS: NavGroup[] = [
  {
    label: 'Overview',
    items: [{ label: 'Dashboard', href: '/admin', icon: AiOutlineDashboard }],
  },
  {
    label: 'Content',
    items: [
      { label: 'Grades', href: '/admin/grades', icon: AiOutlineBook },
      { label: 'Subjects', href: '/admin/subjects', icon: AiOutlineHdd },
      { label: 'Units', href: '/admin/units', icon: AiOutlineBlock },
      { label: 'Topics', href: '/admin/topics', icon: AiOutlineBulb },
    ],
  },
  {
    label: 'Management',
    items: [
      { label: 'Users', href: '/admin/users', icon: AiOutlineUser },
      { label: 'Institutions', href: '/admin/institutions', icon: AiOutlineHdd },
    ],
  },
  {
    label: 'Media',
    items: [
      { label: 'Media Content', href: '/admin/media-content', icon: AiOutlineContainer },
    ],
  },
  {
    label: 'System',
    items: [{ label: 'Settings', href: '/admin/settings', icon: AiOutlineSetting }],
  },
];

export function AdminSidebar({
  collapsed,
  toggleSidebar,
}: {
  collapsed: boolean;
  toggleSidebar: () => void;
}) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin';
    return pathname.startsWith(href);
  };

  return (
    <>
      <aside
        className={cn(
          'fixed left-0 top-[62px] z-20 flex h-[calc(100vh-62px)] flex-col',
          'border-r border-border bg-white shadow-sm transition-all duration-300 dark:bg-gray-900',
          collapsed ? 'w-20' : 'w-64',
        )}
      >
        <ScrollArea className="flex-1 py-4">
          {NAV_GROUPS.map((group) => (
            <div key={group.label} className="mb-3">
              {!collapsed && (
                <p className="mb-1 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {group.label}
                </p>
              )}
              <ul className="space-y-0.5 px-2">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        title={collapsed ? item.label : undefined}
                        className={cn(
                          'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                          active
                            ? 'bg-primary text-primary-foreground'
                            : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                          collapsed && 'justify-center px-2',
                        )}
                      >
                        <Icon className="h-5 w-5 shrink-0" />
                        {!collapsed && <span>{item.label}</span>}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </ScrollArea>

        <div className="border-t border-border p-3">
          <button
            onClick={toggleSidebar}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className={cn(
              'flex w-full items-center justify-center rounded-lg py-2 text-sm text-muted-foreground',
              'transition-colors hover:bg-accent hover:text-accent-foreground',
            )}
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <>
                <ChevronLeft className="h-4 w-4 mr-2" />
                <span className="text-xs">Collapse</span>
              </>
            )}
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {!collapsed && (
        <div
          className="fixed inset-0 z-10 bg-black/50 md:hidden"
          onClick={toggleSidebar}
          aria-hidden="true"
        />
      )}
    </>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npm run test -- AdminSidebar.test 2>&1 | tail -10
```

Expected: PASS — 5 tests passing.

- [ ] **Step 5: Commit**

```bash
git add src/components/admin/layout/AdminSidebar.tsx src/components/admin/layout/AdminSidebar.test.tsx
git commit -m "feat: add AdminSidebar with grouped nav items"
```

---

### Task 4: AdminTopbar component

**Files:**
- Create: `src/components/admin/layout/AdminTopbar.tsx`
- Create: `src/components/admin/layout/AdminTopbar.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `src/components/admin/layout/AdminTopbar.test.tsx`:

```tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AdminTopbar } from './AdminTopbar';

vi.mock('./ThemeToggle', () => ({ ThemeToggle: () => <button>theme</button> }));
vi.mock('./UserDropdown', () => ({ UserDropdown: () => <div>user</div> }));
vi.mock('@components/logo', () => ({ default: () => <span>Logo</span> }));
vi.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, ...props }: any) => (
    <button onClick={onClick} {...props}>{children}</button>
  ),
}));

describe('AdminTopbar', () => {
  const toggleSidebar = vi.fn();

  it('renders the logo', () => {
    render(<AdminTopbar sidebarCollapsed={true} toggleSidebar={toggleSidebar} />);
    expect(screen.getByText('Logo')).toBeInTheDocument();
  });

  it('renders sidebar toggle button', () => {
    render(<AdminTopbar sidebarCollapsed={true} toggleSidebar={toggleSidebar} />);
    expect(screen.getByRole('button', { name: /toggle sidebar/i })).toBeInTheDocument();
  });

  it('calls toggleSidebar when toggle button is clicked', () => {
    render(<AdminTopbar sidebarCollapsed={true} toggleSidebar={toggleSidebar} />);
    fireEvent.click(screen.getByRole('button', { name: /toggle sidebar/i }));
    expect(toggleSidebar).toHaveBeenCalled();
  });

  it('renders ThemeToggle and UserDropdown', () => {
    render(<AdminTopbar sidebarCollapsed={true} toggleSidebar={toggleSidebar} />);
    expect(screen.getByText('theme')).toBeInTheDocument();
    expect(screen.getByText('user')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm run test -- AdminTopbar.test 2>&1 | tail -10
```

Expected: FAIL — `Cannot find module './AdminTopbar'`

- [ ] **Step 3: Create the component**

Create `src/components/admin/layout/AdminTopbar.tsx`:

```tsx
'use client';
import { Bell, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from './ThemeToggle';
import { UserDropdown } from './UserDropdown';
import AppLogo from '@components/logo';
import Link from 'next/link';

export function AdminTopbar({
  sidebarCollapsed,
  toggleSidebar,
}: {
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
}) {
  return (
    <header className="fixed left-0 right-0 top-0 z-30 flex h-[62px] items-center gap-3 border-b border-border bg-white px-4 shadow-sm dark:bg-gray-900">
      <button
        onClick={toggleSidebar}
        aria-label="Toggle sidebar"
        className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
      >
        <Menu className="h-5 w-5" />
      </button>

      <Link href="/admin" className="mr-auto flex items-center gap-2">
        <AppLogo />
      </Link>

      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" aria-label="Notifications" disabled>
          <Bell className="h-5 w-5" />
        </Button>
        <ThemeToggle />
        <UserDropdown />
      </div>
    </header>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npm run test -- AdminTopbar.test 2>&1 | tail -10
```

Expected: PASS — 4 tests passing.

- [ ] **Step 5: Commit**

```bash
git add src/components/admin/layout/AdminTopbar.tsx src/components/admin/layout/AdminTopbar.test.tsx
git commit -m "feat: add AdminTopbar with sidebar toggle, theme, and user controls"
```

---

### Task 5: AdminBreadcrumb component

**Files:**
- Create: `src/components/admin/layout/AdminBreadcrumb.tsx`
- Create: `src/components/admin/layout/AdminBreadcrumb.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `src/components/admin/layout/AdminBreadcrumb.test.tsx`:

```tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AdminBreadcrumb } from './AdminBreadcrumb';

vi.mock('@hooks/useNavigation', () => ({
  default: () => ({
    generateBreadcrumbItems: () => [
      { link: '/admin', label: 'Admin' },
      { link: '/admin/grades', label: 'Grades' },
    ],
    activeMenuItem: { link: '/admin/grades' },
  }),
}));

vi.mock('@/components/ui/breadcrumb', () => ({
  Breadcrumb: ({ children }: any) => <nav aria-label="breadcrumb">{children}</nav>,
  BreadcrumbList: ({ children }: any) => <ol>{children}</ol>,
  BreadcrumbItem: ({ children }: any) => <li>{children}</li>,
  BreadcrumbLink: ({ children, href }: any) => <a href={href}>{children}</a>,
  BreadcrumbPage: ({ children }: any) => <span aria-current="page">{children}</span>,
  BreadcrumbSeparator: () => <span>/</span>,
}));

describe('AdminBreadcrumb', () => {
  it('renders breadcrumb items', () => {
    render(<AdminBreadcrumb />);
    expect(screen.getByText('Admin')).toBeInTheDocument();
    expect(screen.getByText('Grades')).toBeInTheDocument();
  });

  it('renders last item as current page', () => {
    render(<AdminBreadcrumb />);
    expect(screen.getByText('Grades').closest('[aria-current="page"]')).toBeInTheDocument();
  });

  it('renders first item as a link', () => {
    render(<AdminBreadcrumb />);
    expect(screen.getByRole('link', { name: 'Admin' })).toHaveAttribute('href', '/admin');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm run test -- AdminBreadcrumb.test 2>&1 | tail -10
```

Expected: FAIL — `Cannot find module './AdminBreadcrumb'`

- [ ] **Step 3: Create the component**

Create `src/components/admin/layout/AdminBreadcrumb.tsx`:

```tsx
'use client';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import useNavigation from '@hooks/useNavigation';
import { ADMIN_LINKS } from '@components/layouts/adminLayout/links';
import { MdOutlineAdminPanelSettings } from 'react-icons/md';
import React from 'react';

export function AdminBreadcrumb() {
  const { generateBreadcrumbItems, activeMenuItem } = useNavigation();
  const breadcrumbItems = generateBreadcrumbItems(
    ADMIN_LINKS,
    activeMenuItem?.link as string,
  );

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbItems.map((item, index) => (
          <React.Fragment key={item.link}>
            {index > 0 && <BreadcrumbSeparator />}
            <BreadcrumbItem>
              {index === breadcrumbItems.length - 1 ? (
                <BreadcrumbPage className="flex items-center gap-1">
                  {index === 0 && <MdOutlineAdminPanelSettings className="h-4 w-4" />}
                  {item.label}
                </BreadcrumbPage>
              ) : (
                <BreadcrumbLink href={item.link} className="flex items-center gap-1">
                  {index === 0 && <MdOutlineAdminPanelSettings className="h-4 w-4" />}
                  {item.label}
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npm run test -- AdminBreadcrumb.test 2>&1 | tail -10
```

Expected: PASS — 3 tests passing.

- [ ] **Step 5: Commit**

```bash
git add src/components/admin/layout/AdminBreadcrumb.tsx src/components/admin/layout/AdminBreadcrumb.test.tsx
git commit -m "feat: add AdminBreadcrumb using shadcn breadcrumb"
```

---

### Task 6: AdminShell + update admin/layout.tsx

**Files:**
- Create: `src/components/admin/layout/AdminShell.tsx`
- Create: `src/components/admin/layout/AdminShell.test.tsx`
- Modify: `src/app/admin/layout.tsx`

- [ ] **Step 1: Write the failing test**

Create `src/components/admin/layout/AdminShell.test.tsx`:

```tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AdminShell } from './AdminShell';

vi.mock('./AdminSidebar', () => ({
  AdminSidebar: ({ collapsed }: any) => (
    <aside data-testid="sidebar" data-collapsed={String(collapsed)} />
  ),
}));

vi.mock('./AdminTopbar', () => ({
  AdminTopbar: () => <header data-testid="topbar" />,
}));

vi.mock('./AdminBreadcrumb', () => ({
  AdminBreadcrumb: () => <nav data-testid="breadcrumb" />,
}));

describe('AdminShell', () => {
  it('renders topbar', () => {
    render(<AdminShell><div>content</div></AdminShell>);
    expect(screen.getByTestId('topbar')).toBeInTheDocument();
  });

  it('renders sidebar', () => {
    render(<AdminShell><div>content</div></AdminShell>);
    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
  });

  it('renders children', () => {
    render(<AdminShell><div>page content</div></AdminShell>);
    expect(screen.getByText('page content')).toBeInTheDocument();
  });

  it('renders breadcrumb', () => {
    render(<AdminShell><div>content</div></AdminShell>);
    expect(screen.getByTestId('breadcrumb')).toBeInTheDocument();
  });

  it('starts with sidebar collapsed', () => {
    render(<AdminShell><div>content</div></AdminShell>);
    expect(screen.getByTestId('sidebar')).toHaveAttribute('data-collapsed', 'true');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm run test -- AdminShell.test 2>&1 | tail -10
```

Expected: FAIL — `Cannot find module './AdminShell'`

- [ ] **Step 3: Create AdminShell**

Create `src/components/admin/layout/AdminShell.tsx`:

```tsx
'use client';
import { useState, useCallback } from 'react';
import { AdminSidebar } from './AdminSidebar';
import { AdminTopbar } from './AdminTopbar';
import { AdminBreadcrumb } from './AdminBreadcrumb';
import { cn } from '@/lib/utils';

export function AdminShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(true);
  const toggleSidebar = useCallback(() => setCollapsed((v) => !v), []);

  return (
    <div className="min-h-screen bg-background">
      <AdminTopbar sidebarCollapsed={collapsed} toggleSidebar={toggleSidebar} />
      <AdminSidebar collapsed={collapsed} toggleSidebar={toggleSidebar} />
      <main
        id="scrollableDiv"
        className={cn(
          'min-h-screen overflow-y-auto pt-[62px] transition-all duration-300',
          collapsed ? 'md:pl-20' : 'md:pl-64',
        )}
      >
        <div className="p-6">
          <AdminBreadcrumb />
          <div className="mt-4">{children}</div>
        </div>
      </main>
    </div>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npm run test -- AdminShell.test 2>&1 | tail -10
```

Expected: PASS — 5 tests passing.

- [ ] **Step 5: Update admin/layout.tsx to use AdminShell**

Replace the contents of `src/app/admin/layout.tsx` with:

```tsx
'use client';

import { AdminShell } from '@components/admin/layout/AdminShell';
import { withAuthorization } from '@hocs/withAuthorization';
import { ReactNode } from 'react';

const RootLayout = ({ children }: { children: ReactNode | ReactNode[] }) => {
  return <AdminShell>{children}</AdminShell>;
};

export default withAuthorization(RootLayout, { requireAdmin: true });
```

- [ ] **Step 6: Run full test suite**

```bash
npm run test 2>&1 | tail -15
```

Expected: all tests pass.

- [ ] **Step 7: Commit**

```bash
git add src/components/admin/layout/AdminShell.tsx src/components/admin/layout/AdminShell.test.tsx src/app/admin/layout.tsx
git commit -m "feat: wire AdminShell into admin layout — new sidebar, topbar, breadcrumb"
```

---

### Plan 2 Complete

Admin shell is live. Proceed to **Plan 3: Dashboard**.
