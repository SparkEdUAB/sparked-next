'use client';

import i18next from 'i18next';
import React, { useState } from 'react';
import useCourse, { transformRawCourse } from '@hooks/useCourse';
import { T_CourseFields } from '@hooks/useCourse/types';
import { DataTable } from '@components/admin/data-table/DataTable';
import { FormSheet } from '@components/admin/form/FormSheet';
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
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">{i18next.t('courses')}</h1>
      </div>

      <DataTable<T_CourseFields>
        deleteItems={async () => {
          const result = await deleteCourse();
          mutate();
          return result;
        }}
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

      <FormSheet
        open={creatingCourse}
        onClose={() => setCreatingCourse(false)}
        title={`Create ${i18next.t('courses')}`}
      >
        <CreateCourseView
          onSuccessfullyDone={() => {
            mutate();
            setCreatingCourse(false);
          }}
        />
      </FormSheet>

      <FormSheet
        open={!!edittingCourse}
        onClose={() => setEdittingCourse(null)}
        title={`Edit ${i18next.t('courses')}`}
      >
        {edittingCourse && (
          <EditCourseView
            course={edittingCourse}
            onSuccessfullyDone={() => {
              mutate();
              setEdittingCourse(null);
            }}
          />
        )}
      </FormSheet>
    </>
  );
};

export default CourseListView;
