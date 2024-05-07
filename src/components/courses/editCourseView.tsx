/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { AdminPageTitle } from '@components/layouts';
import { transformRawProgram } from '@hooks/useProgram';
import { Button, Spinner } from 'flowbite-react';
import i18next from 'i18next';
import { useSearchParams } from 'next/navigation';
import { FormEventHandler, useEffect } from 'react';
import { COURSE_FORM_FIELDS } from './constants';
import { transformRawSchool } from '@hooks/useSchool';
import useCourse, { transformRawCourse } from '@hooks/useCourse';
import { AdminFormInput } from '@components/admin/AdminForm/AdminFormInput';
import { AdminFormSelector } from '@components/admin/AdminForm/AdminFormSelector';
import { extractValuesFromFormEvent } from 'utils/helpers';
import { T_CourseFields } from '@hooks/useCourse/types';
import { API_LINKS } from 'app/links';
import { useAdminListViewData } from '@hooks/useAdmin/useAdminListViewData';
import { useAdminItemById } from '@hooks/useAdmin/useAdminItemById';
import { LibraryErrorMessage } from '@components/library/LibraryErrorMessage/LibraryErrorMessage';

const EditCourseView = ({ courseId, onSuccessfullyDone }: { courseId?: string; onSuccessfullyDone?: () => void }) => {
  const { editCourse } = useCourse();

  const searchParams = useSearchParams();

  const { item: course, isLoading } = useAdminItemById(
    API_LINKS.FETCH_COURSE_BY_ID,
    courseId || (searchParams.get('courseId') as string),
    'course',
    transformRawCourse,
  );

  const { items: schools, isLoading: loadingSchools } = useAdminListViewData(
    API_LINKS.FETCH_SCHOOLS,
    'schools',
    transformRawSchool,
  );

  const { items: programs, isLoading: loadingPrograms } = useAdminListViewData(
    API_LINKS.FETCH_PROGRAMS,
    'programs',
    transformRawProgram,
  );

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    const keys = [
      COURSE_FORM_FIELDS.name.key,
      COURSE_FORM_FIELDS.description.key,
      COURSE_FORM_FIELDS.school.key,
      COURSE_FORM_FIELDS.program.key,
    ];

    let result = extractValuesFromFormEvent<T_CourseFields>(e, keys);
    editCourse({ ...course, ...result }, onSuccessfullyDone);
  };

  return (
    <>
      <AdminPageTitle title={i18next.t('edit_course')} />

      {course === null ? (
        <div className="flex items-center justify-center h-[400px]">
          <Spinner size="xl" />
        </div>
      ) : course instanceof Error ? (
        <LibraryErrorMessage>{course.message}</LibraryErrorMessage>
      ) : (
        <form className="flex flex-col items-start" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-4 max-w-xl w-full">
            <AdminFormInput
              disabled={isLoading}
              name={COURSE_FORM_FIELDS.name.key}
              label={COURSE_FORM_FIELDS.name.label}
              required
              defaultValue={course.name}
            />

            <AdminFormInput
              disabled={isLoading}
              name={COURSE_FORM_FIELDS.description.key}
              label={COURSE_FORM_FIELDS.description.label}
              required
              defaultValue={course.description}
            />

            <AdminFormSelector
              loadingItems={loadingSchools}
              disabled={isLoading || loadingSchools}
              options={schools}
              label={COURSE_FORM_FIELDS.school.label}
              name={COURSE_FORM_FIELDS.school.key}
              defaultValue={course.schoolId}
            />

            <AdminFormSelector
              loadingItems={loadingPrograms}
              disabled={isLoading || loadingPrograms}
              options={programs}
              label={COURSE_FORM_FIELDS.program.label}
              name={COURSE_FORM_FIELDS.program.key}
              defaultValue={course.programId}
            />

            <Button type="submit" className="mt-2" disabled={isLoading}>
              {isLoading ? <Spinner size="sm" className="mr-3" /> : undefined}
              {i18next.t('submit')}
            </Button>
          </div>
        </form>
      )}
    </>
  );
};

export default EditCourseView;
