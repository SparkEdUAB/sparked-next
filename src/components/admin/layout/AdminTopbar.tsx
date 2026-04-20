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
