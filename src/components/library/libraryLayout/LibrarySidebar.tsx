'use client';

import styles from './Layout.module.css';
import { Sidebar } from 'flowbite-react';
import Link from 'next/link';
import { T_RawCourseFields } from '@hooks/useCourse/types';
import { T_RawUnitFields } from '@hooks/useUnit/types';

export function LibrarySidebar({
  sidebarIsCollapsed,
  toggleSidebar,
  courses,
  units,
}: {
  sidebarIsCollapsed: boolean;
  toggleSidebar: () => void;
  courses: T_RawCourseFields[];
  units: T_RawUnitFields[];
}) {
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
              {courses.map((course) => (
                <Sidebar.Collapse className={styles.collapsible} key={course._id} label={course.name}>
                  {units
                    .filter((unit) => unit.course_id === course._id)
                    .map((unit) => (
                      <Sidebar.Item
                        className={styles.item}
                        as={Link}
                        href={`/library?unit_id=${unit._id}`}
                        key={unit._id}
                      >
                        {unit.name}
                      </Sidebar.Item>
                    ))}
                </Sidebar.Collapse>
              ))}
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
