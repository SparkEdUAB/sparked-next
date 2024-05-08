'use client';

import { ReactNode, useState } from 'react';

import { LibraryNavbar } from '../../components/library/libraryLayout/LibraryNavbar';
import { LibrarySidebar } from '../../components/library/libraryLayout/LibrarySidebar';

export default function LibraryLayout({ children }: { children: ReactNode | ReactNode[] }) {
  const [sidebarIsCollapsed, setSidebarIsCollapsed] = useState(true);
  const toggleSidebar = () => setSidebarIsCollapsed((value) => !value);

  return (
    <div className="h-[calc(100vh_-_62px)]">
      <LibraryNavbar toggleSidebar={toggleSidebar} sidebarIsCollapsed={sidebarIsCollapsed} />
      <div className="md:grid md:grid-cols-[300px_calc(100%_-_300px)] h-[calc(100vh_-_62px)]">
        <LibrarySidebar sidebarIsCollapsed={sidebarIsCollapsed} toggleSidebar={toggleSidebar} />
        <div className="max-h-full overflow-y-hidden">{children}</div>
      </div>
    </div>
  );
}
