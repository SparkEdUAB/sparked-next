import styles from './Layout.module.css';
import { Sidebar } from 'flowbite-react';
import Link from 'next/link';
import { T_RawUnitFields } from '@hooks/useUnit/types';
import { T_RawGradeFields } from '@hooks/useGrade/types';
import { useSearchParams } from 'next/navigation';

import { useSearchQuery } from '@hooks/useSearchQuery';
import { T_RawSubjectFields } from '@hooks/useSubject/types';
import { T_RawMediaTypeFieldes } from '@hooks/use-media-content/types';
import { ShowAllOrNoItems } from './LibraryNoOrAllItems';
import { T_RawTopicFields } from '@hooks/use-topic/types';
import useNavigation from '@hooks/useNavigation';
import { useScreenDetector } from '@hooks/useScreenDetactor';
import { useLayoutEffect } from 'react';

export function LibrarySidebar({
  subjects,
  sidebarIsCollapsed,
  toggleSidebar,
  grades,
  units,
  topics,
  mediaTypes,
}: {
  sidebarIsCollapsed: boolean;
  toggleSidebar: () => void;
  subjects: T_RawSubjectFields[];
  grades: T_RawGradeFields[];
  topics: T_RawTopicFields[];
  units: T_RawUnitFields[];
  mediaTypes: T_RawMediaTypeFieldes[];
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
    // if is Library Page and SideNav is collapsed on navigate set to flase
    if (isLibrary && !isMediaPage && sidebarIsCollapsed) {
      toggleSidebar();
    }
  }, [isMediaPage]);

  const { createQueryString } = useSearchQuery();
  const filterGradeId = useSearchParams().get('grade_id');
  const filteredUnitId = useSearchParams().get('unit_id');
  const filteredSubjectId = useSearchParams().get('subject_id');
  const filteredTopicId = useSearchParams().get('topic_id');
  const filteredMediaType = useSearchParams().get('mediaType');

  return (
    <>
      <div
        className={`${sidebarIsCollapsed ? 'hidden' : 'block'} fixed top-[62px] md:top-0 inset-0 z-50 w-[300px] flex-none md:sticky  h-[calc(100vh_-_62px)] overflow-y-clip
        `}
      >
        <Sidebar
          className={`${styles.sidebar} w-full custom-scrollbar overflow-y-auto h-[calc(100vh_-_62px)] bg-white dark:bg-gray-800 `}
        >
          <Sidebar.Items>
            <Sidebar.ItemGroup>
              <Sidebar.Collapse label="Grades" data-collapse-toggle="true">
                <ShowAllOrNoItems
                  ItemName={'Grades'}
                  items={grades}
                  filterItemId={filterGradeId}
                  url={`/library?${createQueryString('grade_id', '')}`}
                />
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
                <ShowAllOrNoItems
                  ItemName={'Subjects'}
                  items={subjects}
                  filterItemId={filteredSubjectId}
                  url={`/library?${createQueryString('subject_id', '')}`}
                />
                {subjects.map((subject) => (
                  <Sidebar.Item
                    active={filteredSubjectId == subject._id}
                    className={styles.item}
                    as={Link}
                    href={`/library?${createQueryString('subject_id', subject._id)}`}
                    key={subject._id}
                  >
                    {subject.name}
                  </Sidebar.Item>
                ))}
              </Sidebar.Collapse>
            </Sidebar.ItemGroup>

            {/* Topics */}
            <Sidebar.ItemGroup>
              <Sidebar.Collapse label="Topics">
                <ShowAllOrNoItems
                  ItemName={'Topics'}
                  items={topics}
                  filterItemId={filteredTopicId}
                  url={`/library?${createQueryString('topics_id', '')}`}
                />
                {topics.map((topic) => (
                  <Sidebar.Item
                    active={filteredTopicId == topic._id}
                    className={styles.item}
                    as={Link}
                    href={`/library?${createQueryString('topic_id', topic._id)}`}
                    key={topic._id}
                  >
                    {topic.name}
                  </Sidebar.Item>
                ))}
              </Sidebar.Collapse>
            </Sidebar.ItemGroup>

            {/* Units */}
            <Sidebar.ItemGroup>
              <Sidebar.Collapse label="Units">
                <ShowAllOrNoItems
                  ItemName={'Units'}
                  items={units}
                  filterItemId={filteredUnitId}
                  url={`/library?${createQueryString('unit_id', '')}`}
                />
                {units.map((unit) => (
                  <Sidebar.Item
                    key={unit._id}
                    active={filteredUnitId == unit._id}
                    className={styles.item}
                    as={Link}
                    href={`/library?${createQueryString('unit_id', unit._id)}`}
                  >
                    {unit.name}
                  </Sidebar.Item>
                ))}
              </Sidebar.Collapse>
            </Sidebar.ItemGroup>

            {/* Media Types */}
            <Sidebar.ItemGroup>
              <Sidebar.Collapse label="Media Types">
                <ShowAllOrNoItems
                  ItemName={'Media'}
                  items={mediaTypes}
                  filterItemId={filteredMediaType}
                  url={`/library?${createQueryString('mediaType', '')}`}
                />

                {mediaTypes.map((mediaType) => (
                  <Sidebar.Item
                    key={mediaType._id}
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

      {!sidebarIsCollapsed && isMobile && (
        <div
          onClick={toggleSidebar}
          onKeyUp={(key) => key.code === 'Escape' && toggleSidebar()}
          className="fixed cursor-pointer inset-0 z-40 bg-gray-900/50 dark:bg-gray-900/60 backdrop-blur-sm md:backdrop-blur-none md:bg-inherit"
        />
      )}
    </>
  );
}
