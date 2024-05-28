'use client';

import { ReactNode, useState } from 'react';
import { T_RawCourseFields } from '@hooks/useCourse/types';
import { T_RawUnitFields } from '@hooks/useUnit/types';
import { LibraryNavbar } from './LibraryNavbar';
import { LibrarySidebar } from './LibrarySidebar';
import { T_RawGradeFields } from '@hooks/useGrade/types';

export default function LibraryLayout({
  children,
  courses,
  grades,
  units,
}: {
  children: ReactNode;
  courses: T_RawCourseFields[];
  grades: T_RawGradeFields[];
  units: T_RawUnitFields[];
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
          courses={courses}
          grades={grades}
          units={units}
        />
        <div className="max-h-full overflow-y-hidden">{children}</div>
      </div>
    </div>
  );
}
