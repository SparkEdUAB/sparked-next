'use client';

import styles from './Layout.module.css';
import { Sidebar } from 'flowbite-react';
import Link from 'next/link';
import { useEffect } from 'react';
import useCourse from '@hooks/useCourse';
import useUnit from '@hooks/useUnit';
import SkeletonLoaderElement from '@components/skeletonLoader/SkeletonLoaderElement';

export function LibrarySidebar({
  sidebarIsCollapsed,
  toggleSidebar,
}: {
  sidebarIsCollapsed: boolean;
  toggleSidebar: () => void;
}) {
  let { fetchCourses, courses, isLoading: loadingCourses } = useCourse();
  let { fetchUnits, units } = useUnit();

  useEffect(() => {
    fetchUnits({});
    fetchCourses({});
  }, []);

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
          {loadingCourses ? (
            <SidebarSkeletonLoader />
          ) : (
            <Sidebar.Items>
              <Sidebar.ItemGroup>
                {courses.map((course) => (
                  <Sidebar.Collapse className={styles.collapsible} key={course._id} label={course.name}>
                    {units
                      .filter((unit) => unit.courseId === course._id)
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
          )}
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

function SidebarSkeletonLoader() {
  return (
    <div className="flex flex-col p-4">
      {new Array(4).fill(0).map((_, index) => (
        <>
          <SkeletonLoaderElement key={index} className="w-[calc(100%_-_20px)] h-7 mb-4" />
          {new Array(2).fill(0).map((_, index) => (
            <SkeletonLoaderElement key={index} className="w-[calc(100%_-_30px)] h-7 mb-4 ml-[30px]" />
          ))}
        </>
      ))}
    </div>
  );
}
