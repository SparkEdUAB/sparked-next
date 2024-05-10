'use client';

import { AdminPageTitle } from '@components/layouts';
import { Modal } from 'flowbite-react';
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
  const [edittingCourseWithId, setEdittingCourseWithId] = useState<string | null>(null);

  const {
    items: courses,
    isLoading,
    mutate,
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
        editItem={(id) => setEdittingCourseWithId(id)}
        columns={courseTableColumns}
        onSearchQueryChange={onSearchQueryChange}
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
      <Modal dismissible show={!!edittingCourseWithId} onClose={() => setEdittingCourseWithId(null)} popup>
        <Modal.Header />
        <Modal.Body>
          {edittingCourseWithId ? (
            <EditCourseView
              courseId={edittingCourseWithId}
              onSuccessfullyDone={() => {
                mutate();
                setEdittingCourseWithId(null);
              }}
            />
          ) : null}
        </Modal.Body>
      </Modal>
    </>
  );
};

export default CourseListView;
