import styles from './Layout.module.css';
import { Sidebar } from 'flowbite-react';
import Link from 'next/link';
import { T_UnitFields } from '@hooks/useUnit/types';
import { T_GradeFields } from '@hooks/useGrade/types';
import { useSearchParams } from 'next/navigation';

import { useSearchQuery } from '@hooks/useSearchQuery';
import { T_SubjectFields } from '@hooks/useSubject/types';
import { T_RawMediaTypeFieldes } from '@hooks/use-media-content/types';
import { ShowAllOrNoItems } from './LibraryNoOrAllItems';
import { T_TopicFields } from '@hooks/use-topic/types';
import useNavigation from '@hooks/useNavigation';
import { useScreenDetector } from '@hooks/useScreenDetactor';
import { useEffect, useLayoutEffect } from 'react';
import NETWORK_UTILS from 'utils/network';

export function LibrarySidebar({
  subjects,
  sidebarIsCollapsed,
  toggleSidebar,
  grades,
  units,
  topics,
  mediaTypes,
  isUnitsLoading,
  isSubjectsLoading,
  isTopicsLoading,
  isGradesLoading,
  isMediaTypesLoading,
}: {
  sidebarIsCollapsed: boolean;
  toggleSidebar: () => void;
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
  const { isMobile } = useScreenDetector();
  const { pathname } = useNavigation();
  const sliptPathname = pathname.split('/');

  const isMediaPage = sliptPathname[2] == 'media';
  const isLibrary = sliptPathname[1] == 'library';

  useLayoutEffect(() => {
    // if is media Page and SideNav is not collapsed on navigate set to true
    if (isLibrary && isMediaPage && !sidebarIsCollapsed) {
      toggleSidebar();
    }
    // if is Library Page and SideNav is collapsed on navigate set to false
    if (isLibrary && !isMediaPage && sidebarIsCollapsed) {
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
  const filteredMediaType = useSearchParams().get('mediaType');

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
                      active={filteredGradeId == grade._id}
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
                        active={filteredSubjectId == subject._id}
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
                        active={filteredUnitId == unit._id}
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
                        active={filteredTopicId == topic._id}
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

            {/* Media Types */}
            <Sidebar.ItemGroup>
              <Sidebar.Collapse label="Media Types">
                {!isMediaTypesLoading && (
                  <ShowAllOrNoItems
                    ItemName={'Media'}
                    items={mediaTypes}
                    filterItemId={filteredMediaType}
                    url={`/library?${createQueryString('mediaType', '')}`}
                  />
                )}

                {isMediaTypesLoading ? (
                  <SidebarItemsSkeleton />
                ) : (
                  !isMediaTypesLoading &&
                  mediaTypes.map((mediaType) => (
                    <Sidebar.Item
                      key={mediaType._id}
                      active={filteredMediaType == mediaType.name}
                      className={styles.item}
                      as={Link}
                      href={`/library?${createQueryString('mediaType', mediaType.name)}`}
                    >
                      {mediaType.name}
                    </Sidebar.Item>
                  ))
                )}
              </Sidebar.Collapse>
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
