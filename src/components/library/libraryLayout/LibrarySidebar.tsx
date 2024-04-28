'use client';

import styles from './Layout.module.css';
import { Sidebar } from 'flowbite-react';
import Link from 'next/link';
import SkeletonLoaderElement from '@components/skeletonLoader/SkeletonLoaderElement';
import { API_LINKS } from 'app/links';
import { useFetch } from '@hooks/use-swr';
import NETWORK_UTILS from 'utils/network';
import { T_RawCourseFields } from '@hooks/useCourse/types';
import { T_RawUnitFields } from '@hooks/useUnit/types';

export function LibrarySidebar({
  sidebarIsCollapsed,
  toggleSidebar,
}: {
  sidebarIsCollapsed: boolean;
  toggleSidebar: () => void;
}) {
  const { data: coursesData, isLoading: coursesLoading } = useFetch<{ courses: T_RawCourseFields[] }>(
    API_LINKS.FETCH_COURSES + NETWORK_UTILS.formatGetParams({ limit: '20', skip: '0', withMetaData: 'true' }),
  );

  const { data: unitsData } = useFetch<{ units: T_RawUnitFields[] }>(
    API_LINKS.FETCH_UNITS + NETWORK_UTILS.formatGetParams({ limit: '20', skip: '0', withMetaData: 'true' }),
  );

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
          {coursesLoading ? (
            <SidebarSkeletonLoader />
          ) : (
            <Sidebar.Items>
              <Sidebar.ItemGroup>
                {coursesData &&
                  !(coursesData instanceof Error) &&
                  coursesData.courses.map((course) => (
                    <Sidebar.Collapse className={styles.collapsible} key={course._id} label={course.name}>
                      {unitsData &&
                        !(unitsData instanceof Error) &&
                        unitsData.units
                          .filter((unit) => unit.course?._id === course._id)
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
