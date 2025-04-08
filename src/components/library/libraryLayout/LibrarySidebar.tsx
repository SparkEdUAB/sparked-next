import { T_GradeFields } from '@hooks/useGrade/types';
import { T_UnitFields } from '@hooks/useUnit/types';
import { Sidebar } from 'flowbite-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import styles from './Layout.module.css';

import { T_TopicFields } from '@hooks/use-topic/types';
import useNavigation from '@hooks/useNavigation';
import { useScreenDetector } from '@hooks/useScreenDetactor';
import { useSearchQuery } from '@hooks/useSearchQuery';
import { T_SubjectFields } from '@hooks/useSubject/types';
import { useRouter } from 'next/navigation';
import { useEffect, useLayoutEffect } from 'react';
import NETWORK_UTILS from 'utils/network';
import { ShowAllOrNoItems } from './LibraryNoOrAllItems';

export function LibrarySidebar({
  subjects,
  sidebarIsCollapsed,
  toggleSidebar,
  grades,
  units,
  topics,
  isUnitsLoading,
  isSubjectsLoading,
  isTopicsLoading,
  isGradesLoading,
}: {
  sidebarIsCollapsed: boolean;
  toggleSidebar: () => void;
  subjects: T_SubjectFields[];
  topics: T_TopicFields[];
  grades: T_GradeFields[];
  units: T_UnitFields[];
  isUnitsLoading: boolean;
  isSubjectsLoading: boolean;
  isTopicsLoading: boolean;
  isGradesLoading: boolean;
  isMediaTypesLoading: boolean;
}) {
  const { isMobile } = useScreenDetector();
  const { pathname } = useNavigation();
  const sliptPathname = pathname.split('/');

  const isMediaPage = sliptPathname[2] === 'media';
  const isLibrary = sliptPathname[1] === 'library';
  const isSearchPage = sliptPathname.includes('search');

  const router = useRouter();
  const searchParams = useSearchParams();
  const isExternalContent = searchParams.get('externalContent') === 'true';

  const handleExternalContentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      router.push(`/library?${createQueryString('externalContent', 'true')}`);
    } else {
      const params = new URLSearchParams(window.location.search);
      params.delete('externalContent');
      router.push(`/library?${params.toString()}`);
    }
  };

  useLayoutEffect(() => {
    if (isLibrary && isMediaPage && !sidebarIsCollapsed) {
      toggleSidebar();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLibrary, isMediaPage]);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => event.code === 'Escape' && toggleSidebar();
    document.addEventListener('keyup', handler);
    return () => document.removeEventListener('keyup', handler);
  }, [toggleSidebar]);

  const { createQueryString } = useSearchQuery();
  const filteredGradeId = useSearchParams().get('grade_id');
  const filteredUnitId = useSearchParams().get('unit_id');
  const filteredSubjectId = useSearchParams().get('subject_id');
  const filteredTopicId = useSearchParams().get('topic_id');

  const backToLibrary = isMediaPage || isSearchPage;

  return (
    <>
      <div
        className={`${
          sidebarIsCollapsed ? '-left-[300px] md:hidden' : 'left-0 md:block'
        } fixed top-[62px] md:top-0 inset-0 z-50 w-[300px] transition-all duration-300 flex-none md:sticky h-[calc(100vh_-_62px)] overflow-y-clip
        `}
      >
        <Sidebar
          className={`${styles.sidebar} w-full custom-scrollbar overflow-y-auto h-[calc(100vh_-_62px)] bg-white dark:bg-gray-800 `}
        >
          <Sidebar.Items>
            <Sidebar.ItemGroup>
              <Sidebar.Item
                as={Link}
                href={backToLibrary ? '/library' : '/'}
                className={`${styles.item} mb-4`}
                icon={() => <span className="mr-2">←</span>}
                onClick={toggleSidebar}
              >
                {backToLibrary ? 'Back to Library' : 'Back to Home'}
              </Sidebar.Item>
            </Sidebar.ItemGroup>
            <Sidebar.ItemGroup>
              <Sidebar.Collapse label="Grades" data-collapse-toggle="true">
                {!isGradesLoading && (
                  <ShowAllOrNoItems
                    ItemName={'Grades'}
                    items={grades}
                    filterItemId={filteredGradeId}
                    url={`/library`}
                  />
                )}

                {isGradesLoading ? (
                  <SidebarItemsSkeleton />
                ) : (
                  !isGradesLoading &&
                  grades.map((grade) => (
                    <Sidebar.Item
                      active={filteredGradeId === grade._id}
                      className={styles.item}
                      as={Link}
                      href={`/library?grade_id=${grade._id}`}
                      key={grade._id}
                    >
                      {grade.name}
                    </Sidebar.Item>
                  ))
                )}
              </Sidebar.Collapse>
            </Sidebar.ItemGroup>

            {/* Subjects */}
            {(!!filteredGradeId || !!filteredSubjectId || !!filteredUnitId || !!filteredTopicId) && (
              <Sidebar.ItemGroup>
                <Sidebar.Collapse label="Subjects">
                  {!isSubjectsLoading && (
                    <ShowAllOrNoItems
                      ItemName={'Subjects'}
                      items={subjects}
                      filterItemId={filteredSubjectId}
                      url={`/library?grade_id=${filteredGradeId}`}
                    />
                  )}

                  {isSubjectsLoading ? (
                    <SidebarItemsSkeleton />
                  ) : (
                    !isSubjectsLoading &&
                    subjects.map((subject) => (
                      <Sidebar.Item
                        active={filteredSubjectId === subject._id}
                        className={styles.item}
                        as={Link}
                        href={
                          '/library' +
                          NETWORK_UTILS.formatGetParams({
                            grade_id: filteredGradeId as string,
                            subject_id: subject._id,
                          })
                        }
                        key={subject._id}
                      >
                        {subject.name}
                      </Sidebar.Item>
                    ))
                  )}
                </Sidebar.Collapse>
              </Sidebar.ItemGroup>
            )}

            {/* Units */}
            {(!!filteredSubjectId || !!filteredUnitId || !!filteredTopicId) && (
              <Sidebar.ItemGroup>
                <Sidebar.Collapse label="Units">
                  {!isUnitsLoading && (
                    <ShowAllOrNoItems
                      ItemName={'Units'}
                      items={units}
                      filterItemId={filteredUnitId}
                      url={
                        '/library' +
                        NETWORK_UTILS.formatGetParams({
                          grade_id: filteredGradeId as string,
                          subject_id: filteredSubjectId as string,
                        })
                      }
                    />
                  )}

                  {isUnitsLoading ? (
                    <SidebarItemsSkeleton />
                  ) : (
                    !isUnitsLoading &&
                    units.map((unit) => (
                      <Sidebar.Item
                        key={unit._id}
                        active={filteredUnitId === unit._id}
                        className={styles.item}
                        as={Link}
                        href={
                          '/library' +
                          NETWORK_UTILS.formatGetParams({
                            grade_id: filteredGradeId as string,
                            subject_id: filteredSubjectId as string,
                            unit_id: unit._id,
                          })
                        }
                      >
                        {unit.name}
                      </Sidebar.Item>
                    ))
                  )}
                </Sidebar.Collapse>
              </Sidebar.ItemGroup>
            )}

            {/* Topics */}
            {(!!filteredUnitId || !!filteredTopicId) && (
              <Sidebar.ItemGroup>
                <Sidebar.Collapse label="Topics">
                  {!isTopicsLoading && (
                    <ShowAllOrNoItems
                      ItemName={'Topics'}
                      items={topics}
                      filterItemId={filteredTopicId}
                      url={
                        '/library' +
                        NETWORK_UTILS.formatGetParams({
                          grade_id: filteredGradeId as string,
                          subject_id: filteredSubjectId as string,
                          unit_id: filteredUnitId as string,
                        })
                      }
                    />
                  )}

                  {isTopicsLoading ? (
                    <SidebarItemsSkeleton />
                  ) : (
                    !isTopicsLoading &&
                    topics.map((topic) => (
                      <Sidebar.Item
                        active={filteredTopicId === topic._id}
                        className={styles.item}
                        as={Link}
                        href={
                          '/library' +
                          NETWORK_UTILS.formatGetParams({
                            grade_id: filteredGradeId as string,
                            subject_id: filteredSubjectId as string,
                            unit_id: filteredUnitId as string,
                            topic_id: topic._id,
                          })
                        }
                        key={topic._id}
                      >
                        {topic.name}
                      </Sidebar.Item>
                    ))
                  )}
                </Sidebar.Collapse>
              </Sidebar.ItemGroup>
            )}

            <Sidebar.ItemGroup>
              <div className="flex items-center px-3 py-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                <input
                  id="external-content-checkbox"
                  type="checkbox"
                  checked={isExternalContent}
                  className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  onChange={handleExternalContentChange}
                />
                <label
                  htmlFor="external-content-checkbox"
                  className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300 cursor-pointer"
                >
                  Show External Content
                </label>
              </div>
            </Sidebar.ItemGroup>
          </Sidebar.Items>
        </Sidebar>
      </div>
      <div
        onClick={toggleSidebar}
        className={`fixed cursor-pointer inset-0 z-40 transition-all duration-300 rounded-br-full bg-gray-900/50 dark:bg-gray-900/60 backdrop-blur-sm md:backdrop-blur-none md:bg-inherit ${
          sidebarIsCollapsed || !isMobile ? 'w-0 h-0' : 'w-[200vmax] h-[200vmax]'
        }`}
      />
    </>
  );
}

function SidebarItemsSkeleton() {
  return (
    <div role="status" className="max-w-sm animate-pulse pl-10">
      <div className="h-6 bg-gray-200 rounded-md dark:bg-gray-700 w-full mb-4"></div>
      <div className="h-6 bg-gray-200 rounded-md dark:bg-gray-700 w-full mb-4"></div>
      <div className="h-6 bg-gray-200 rounded-md dark:bg-gray-700 w-full mb-4"></div>
      <span className="sr-only">Loading...</span>
    </div>
  );
}
