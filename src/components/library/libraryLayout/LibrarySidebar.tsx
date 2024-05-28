'use client';

import styles from './Layout.module.css';
import { Sidebar } from 'flowbite-react';
import Link from 'next/link';
import { T_RawCourseFields } from '@hooks/useCourse/types';
import { T_RawUnitFields } from '@hooks/useUnit/types';
import { T_RawGradeFields } from '@hooks/useGrade/types';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useSearchQuery } from '@hooks/useSearchQuery';

export function LibrarySidebar({
  sidebarIsCollapsed,
  toggleSidebar,
  courses,
  grades,
  units,
}: {
  sidebarIsCollapsed: boolean;
  toggleSidebar: () => void;
  courses: T_RawCourseFields[];
  grades: T_RawGradeFields[];
  units: T_RawUnitFields[];
}) {
  const { createQueryString } = useSearchQuery();
  const filterGradeId = useSearchParams().get('grade_id');
  const filteredUnitId = useSearchParams().get('unit_id');

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
              <Sidebar.Collapse label="Courses">
                <Sidebar.Item
                  active={!filteredUnitId}
                  className={styles.item}
                  as={Link}
                  href={`/library?${createQueryString('unit_id', '')}`}
                >
                  All Courses
                </Sidebar.Item>
                {courses.map((course) => (
                  <Sidebar.Collapse className={styles.collapsible} key={course._id} label={course.name}>
                    {units
                      .filter((unit) => unit.course_id === course._id)
                      .map((unit) => (
                        <Sidebar.Item
                          focused={true}
                          active={filteredUnitId == unit._id}
                          className={styles.item}
                          as={Link}
                          href={`/library?${createQueryString('unit_id', unit._id)}`}
                          key={unit._id}
                        >
                          {unit.name}
                        </Sidebar.Item>
                      ))}
                  </Sidebar.Collapse>
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
