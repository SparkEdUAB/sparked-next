'use client';

import { ReactNode, useCallback, useState } from 'react';
import { T_SubjectFields } from '@hooks/useSubject/types';
import { LibraryNavbar } from './LibraryNavbar';
import { LibrarySidebar } from './LibrarySidebar';
import { T_GradeFields } from '@hooks/useGrade/types';
import { T_RawMediaTypeFieldes } from '@hooks/use-media-content/types';
import { T_TopicFields } from '@hooks/use-topic/types';

import { T_UnitFields } from '@hooks/useUnit/types';

export default function LibraryLayout({
  children,
  subjects,
  topics,
  grades,
  units,
  isUnitsLoading,
  isSubjectsLoading,
  isTopicsLoading,
  isGradesLoading,
}: {
  children: ReactNode;
  subjects: T_SubjectFields[];
  topics: T_TopicFields[];
  grades: T_GradeFields[];
  units: T_UnitFields[];
  isUnitsLoading: boolean;
  isSubjectsLoading: boolean;
  isTopicsLoading: boolean;
  isGradesLoading: boolean;
}) {
  const [sidebarIsCollapsed, setSidebarIsCollapsed] = useState(true);
  const toggleSidebar = useCallback(() => setSidebarIsCollapsed((value) => !value), [setSidebarIsCollapsed]);

  return (
    <div className="h-[calc(100vh_-_62px)]">
      <LibraryNavbar toggleSidebar={toggleSidebar} sidebarIsCollapsed={sidebarIsCollapsed} />
      <div className="flex h-[calc(100vh_-_62px)]">
        <LibrarySidebar
          sidebarIsCollapsed={sidebarIsCollapsed}
          toggleSidebar={toggleSidebar}
          subjects={subjects}
          topics={topics}
          grades={grades}
          units={units}
          isUnitsLoading={isUnitsLoading}
          isSubjectsLoading={isSubjectsLoading}
          isTopicsLoading={isTopicsLoading}
          isGradesLoading={isGradesLoading}
        />
        <div className="max-h-full overflow-y-hidden w-screen ">{children}</div>
      </div>
    </div>
  );
}
