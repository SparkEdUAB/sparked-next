'use client';

import styles from './Layout.module.css';
import { Sidebar } from 'flowbite-react';
import Link from 'next/link';
import { T_RawUnitFields } from '@hooks/useUnit/types';
import { T_RawGradeFields } from '@hooks/useGrade/types';
import { useSearchParams } from 'next/navigation';

import { useSearchQuery } from '@hooks/useSearchQuery';
import { T_RawSubjectFields } from '@hooks/useSubject/types';
import { T_RawMediaTypeFieldes } from '@hooks/use-media-content/types';

export function LibrarySidebar({
  sidebarIsCollapsed,
  toggleSidebar,
  subjects,
  grades,
  units,
  mediaTypes,
}: {
  sidebarIsCollapsed: boolean;
  toggleSidebar: () => void;
  subjects: T_RawSubjectFields[];
  grades: T_RawGradeFields[];
  units: T_RawUnitFields[];
  mediaTypes: T_RawMediaTypeFieldes[];
}) {
  const { createQueryString } = useSearchQuery();
  const filterGradeId = useSearchParams().get('grade_id');
  const filteredUnitId = useSearchParams().get('unit_id');
  const filteredMediaType = useSearchParams().get('mediaType');

  return (
    <>
      <div
        className={`fixed top-[62px] md:top-0 inset-0 z-50 w-[300px] flex-none md:sticky md:block h-[calc(100vh_-_62px)] overflow-y-clip ${
          sidebarIsCollapsed ? 'hidden' : ''
        }`}
      >
        <Sidebar
          className={`${styles.sidebar} w-full custom-scrollbar overflow-y-auto h-[calc(100vh_-_62px)] bg-white dark:bg-gray-800`}
        >
          <Sidebar.Items>
            <Sidebar.ItemGroup>
              <Sidebar.Collapse label="Grades" data-collapse-toggle="true">
                <Sidebar.Item
                  active={!filterGradeId}
                  className={styles.item}
                  as={Link}
                  href={`/library?${createQueryString('grade_id', '')}`}
                >
                  All
                </Sidebar.Item>
                {grades.map((grade) => (
                  <Sidebar.Item
                    active={filterGradeId == grade._id}
                    className={styles.item}
                    as={Link}
                    href={`/library?${createQueryString('grade_id', grade._id)}`}
                    key={grade._id}
                  >
                    {grade.name}
                  </Sidebar.Item>
                ))}
              </Sidebar.Collapse>
            </Sidebar.ItemGroup>

            <Sidebar.ItemGroup>
              <Sidebar.Collapse label="Subjects">
                <Sidebar.Item
                  active={!filteredUnitId}
                  className={styles.item}
                  as={Link}
                  href={`/library?${createQueryString('subject_id', '')}`}
                >
                  All Subject
                </Sidebar.Item>
                {subjects.map((subject) => (
                  <Sidebar.Collapse className={styles.collapsible} key={subject._id} label={subject.name}>
                    <Sidebar.Item
                      focused={true}
                      active={filteredUnitId == subject._id}
                      className={styles.item}
                      as={Link}
                      href={`/library?${createQueryString('subject_id', subject._id)}`}
                      key={subject._id}
                    >
                      {subject.name}
                    </Sidebar.Item>
                  </Sidebar.Collapse>
                ))}
              </Sidebar.Collapse>
            </Sidebar.ItemGroup>

            {/* Media Types */}
            <Sidebar.ItemGroup>
              <Sidebar.Collapse label="Media Types">
                <Sidebar.Item
                  active={!filteredMediaType}
                  className={styles.item}
                  as={Link}
                  href={`/library?${createQueryString('mediaType', '')}`}
                >
                  All Media
                </Sidebar.Item>
                {mediaTypes.map((mediaType) => (
                  <Sidebar.Item
                    key={mediaType._id}
                    focused={true}
                    active={filteredMediaType == mediaType.name}
                    className={styles.item}
                    as={Link}
                    href={`/library?${createQueryString('mediaType', mediaType.name)}`}
                  >
                    {mediaType.name}
                  </Sidebar.Item>
                ))}
              </Sidebar.Collapse>
            </Sidebar.ItemGroup>
          </Sidebar.Items>
        </Sidebar>
      </div>

      {!sidebarIsCollapsed && (
        <div
          onClick={toggleSidebar}
          onKeyUp={(key) => key.code === 'Escape' && toggleSidebar()}
          className="fixed cursor-pointer inset-0 z-40 bg-gray-900/50 dark:bg-gray-900/60 backdrop-blur-sm md:hidden"
        />
      )}
    </>
  );
}
