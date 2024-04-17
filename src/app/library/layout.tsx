'use client';

import { DarkThemeToggle, Navbar, Sidebar, TextInput } from 'flowbite-react';
import Link from 'next/link';
import { ReactNode, useEffect, useState } from 'react';
import { HiSearch, HiX } from 'react-icons/hi';
import { MdMenu } from 'react-icons/md';

import styles from './Layout.module.css';
import AppLogo from '@components/logo';
import { extractValuesFromFormEvent } from 'utils/helpers';
import useNavigation from '@hooks/useNavigation';
import useCourse from '@hooks/useCourse';
import useUnit from '@hooks/useUnit';
import LibraryLoader from '@components/library/LibraryLoader';

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

function LibraryNavbar({
  toggleSidebar,
  sidebarIsCollapsed,
}: {
  toggleSidebar: () => void;
  sidebarIsCollapsed: boolean;
}) {
  let [searching, setSearching] = useState(false);
  let { router } = useNavigation();

  return (
    <Navbar fluid rounded className="sticky top-0 z-[60]">
      <div className={`pl-2 flex flex-row gap-4 ${searching ? 'hidden md:flex' : ''}`}>
        <button
          type="button"
          className="text-gray-500 -ml-3 mr-1 p-2 md:ml-0 md:mr-0 md:hidden"
          onClick={toggleSidebar}
        >
          {sidebarIsCollapsed ? (
            <MdMenu aria-label="Open sidebar" className="h-6 w-6 cursor-pointer text-gray-500 dark:text-gray-400" />
          ) : (
            <HiX aria-label="Close sidebar" className="h-6 w-6 cursor-pointer text-gray-500 dark:text-gray-400" />
          )}
        </button>
        <Navbar.Brand as={Link} href="/library">
          <AppLogo />
        </Navbar.Brand>
      </div>
      <div className={`flex flex-row gap-4 ${searching ? 'w-full md:w-fit' : ''}`}>
        <form
          action="/"
          method="get"
          onSubmit={(e) => {
            e.preventDefault();
            let { q } = extractValuesFromFormEvent<{ q: string }>(e, ['q']);
            router.push(`/library/search?${new URLSearchParams({ q }).toString()}`);
          }}
        >
          <TextInput
            className={`w-full ${searching ? '' : 'hidden md:block'}`}
            type="search"
            placeholder="Search"
            name="q"
            icon={HiSearch}
          />
        </form>
        <button
          onClick={() => setSearching((value) => !value)}
          className="rounded-lg md:hidden p-2.5 text-sm text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-700"
        >
          {searching ? <HiX size={22} /> : <HiSearch size={22} />}
        </button>
        <DarkThemeToggle className={`${searching ? 'hidden md:flex' : ''}`} />
      </div>
    </Navbar>
  );
}

function LibrarySidebar({
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
            <LibraryLoader />
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
