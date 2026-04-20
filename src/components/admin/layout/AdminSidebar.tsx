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
