'use client';

import { ReactNode, useState } from 'react';
import { T_RawSubjectFields } from '@hooks/useSubject/types';
import { T_RawUnitFields } from '@hooks/useUnit/types';
import { LibraryNavbar } from './LibraryNavbar';
import { LibrarySidebar } from './LibrarySidebar';
import { T_RawGradeFields } from '@hooks/useGrade/types';
import { T_RawMediaTypeFieldes } from '@hooks/use-media-content/types';

export default function LibraryLayout({
  children,
  subjects,
  grades,
  units,
  mediaTypes,
}: {
  children: ReactNode;
  subjects: T_RawSubjectFields[];
  grades: T_RawGradeFields[];
  units: T_RawUnitFields[];
  mediaTypes: T_RawMediaTypeFieldes[];
}) {
  const [sidebarIsCollapsed, setSidebarIsCollapsed] = useState(true);
  const toggleSidebar = () => setSidebarIsCollapsed((value) => !value);

  return (
    <div className="h-[calc(100vh_-_62px)]">
      <LibraryNavbar toggleSidebar={toggleSidebar} sidebarIsCollapsed={sidebarIsCollapsed} />
      <div className="md:grid md:grid-cols-[300px_calc(100%_-_300px)] h-[calc(100vh_-_62px)]">
        <LibrarySidebar
          sidebarIsCollapsed={sidebarIsCollapsed}
          toggleSidebar={toggleSidebar}
          subjects={subjects}
          grades={grades}
          units={units}
          mediaTypes={mediaTypes}
        />
        <div className="max-h-full overflow-y-hidden">{children}</div>
      </div>
    </div>
  );
}
