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
  mediaTypes,
  isUnitsLoading,
  isSubjectsLoading,
  isTopicsLoading,
  isGradesLoading,
  isMediaTypesLoading,
}: {
  children: ReactNode;
  subjects: T_SubjectFields[];
  topics: T_TopicFields[];
  grades: T_GradeFields[];
  units: T_UnitFields[];
  mediaTypes: T_RawMediaTypeFieldes[];
  isUnitsLoading: boolean;
  isSubjectsLoading: boolean;
  isTopicsLoading: boolean;
  isGradesLoading: boolean;
  isMediaTypesLoading: boolean;
}) {
  const [sidebarIsCollapsed, setSidebarIsCollapsed] = useState(false);
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
          mediaTypes={mediaTypes}
          isUnitsLoading={isUnitsLoading}
          isSubjectsLoading={isSubjectsLoading}
          isTopicsLoading={isTopicsLoading}
          isGradesLoading={isGradesLoading}
          isMediaTypesLoading={isMediaTypesLoading}
        />
        <div className="max-h-full overflow-y-hidden w-screen ">{children}</div>
      </div>
    </div>
  );
}
