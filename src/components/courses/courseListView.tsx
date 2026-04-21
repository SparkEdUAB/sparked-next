'use client';

import { AdminPageTitle } from '@components/layouts';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Sheet, SheetContent } from '@/components/ui/sheet';
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
      <Dialog open={creatingCourse} onOpenChange={setCreatingCourse}>
        <DialogContent>
          <CreateCourseView
            onSuccessfullyDone={() => {
              mutate();
              setCreatingCourse(false);
            }}
          />
        </DialogContent>
      </Dialog>
      <Sheet open={!!edittingCourse} onOpenChange={(open) => { if (!open) setEdittingCourse(null); }}>
        <SheetContent className="w-[360px] sm:w-[460px] lg:w-[560px]">
          {edittingCourse ? (
            <EditCourseView
              course={edittingCourse}
              onSuccessfullyDone={() => {
                mutate();
                setEdittingCourse(null);
              }}
            />
          ) : null}
        </SheetContent>
      </Sheet>
    </>
  );
};

export default CourseListView;
