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
