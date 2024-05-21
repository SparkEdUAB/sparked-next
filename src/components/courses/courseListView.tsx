'use client';

import { AdminPageTitle } from '@components/layouts';
import { Drawer, Modal } from 'flowbite-react';
import i18next from 'i18next';
import React, { useState } from 'react';
import useCourse, { transformRawCourse } from '@hooks/useCourse';
import { T_CourseFields } from '@hooks/useCourse/types';
import { AdminTable } from '../admin/AdminTable/AdminTable';
import { courseTableColumns } from '.';
import EditCourseView from './editCourseView';
import CreateCourseView from './createCourseView';
import { API_LINKS } from 'app/links';
import { useAdminListViewData } from '@hooks/useAdmin/useAdminListViewData';

const CourseListView: React.FC = () => {
  const { selectedCourseIds, setSelectedCourseIds, onSearchQueryChange, deleteCourse, searchQuery } = useCourse();
  const [creatingCourse, setCreatingCourse] = useState(false);
  const [edittingCourse, setEdittingCourse] = useState<T_CourseFields | null>(null);

  const {
    items: courses,
    isLoading,
    mutate,
    loadMore,
    hasMore,
    error,
  } = useAdminListViewData(
    API_LINKS.FETCH_COURSES,
    'courses',
    transformRawCourse,
    API_LINKS.FIND_COURSE_BY_NAME,
    searchQuery,
  );

  const rowSelection = {
    selectedRowKeys: selectedCourseIds,
    onChange: (selectedRowKeys: React.Key[]) => {
      setSelectedCourseIds(selectedRowKeys);
    },
  };

  return (
    <>
      <AdminPageTitle title={i18next.t('courses')} />

      <AdminTable<T_CourseFields>
        deleteItems={deleteCourse}
        rowSelection={rowSelection}
        items={courses}
        isLoading={isLoading}
        createNew={() => setCreatingCourse(true)}
        editItem={(item) => setEdittingCourse(item)}
        columns={courseTableColumns}
        onSearchQueryChange={onSearchQueryChange}
        hasMore={hasMore}
        loadMore={loadMore}
        error={error}
      />
      <Modal dismissible show={creatingCourse} onClose={() => setCreatingCourse(false)} popup>
        <Modal.Header />
        <Modal.Body>
          <CreateCourseView
            onSuccessfullyDone={() => {
              mutate();
              setCreatingCourse(false);
            }}
          />
        </Modal.Body>
      </Modal>
      <Drawer
        className="w-[360px] sm:w-[460px] lg:w-[560px]"
        open={!!edittingCourse}
        onClose={() => setEdittingCourse(null)}
        position="right"
      >
        <Drawer.Header titleIcon={() => <></>} />
        <Drawer.Items>
          {edittingCourse ? (
            <EditCourseView
              course={edittingCourse}
              onSuccessfullyDone={() => {
                mutate();
                setEdittingCourse(null);
              }}
            />
          ) : null}
        </Drawer.Items>
      </Drawer>
    </>
  );
};

export default CourseListView;
