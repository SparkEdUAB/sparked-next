/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { AdminPageTitle } from '@components/layouts';
import useProgram from '@hooks/useProgram';
import { Button, Spinner } from 'flowbite-react';
import i18next from 'i18next';
import { useSearchParams } from 'next/navigation';
import { FormEventHandler, useEffect } from 'react';
import { COURSE_FORM_FIELDS } from './constants';
import useSchool from '@hooks/useSchool';
import useCourse from '@hooks/useCourse';
import { AdminFormInput } from '@components/admin/AdminForm/AdminFormInput';
import { AdminFormSelector } from '@components/admin/AdminForm/AdminFormSelector';
import { extractValuesFromFormEvent } from 'utils/helpers';
import { TcourseFields } from '@hooks/useCourse/types';

const EditCourseView: React.FC = () => {
  const { editCourse, fetchCourseById, course, isLoading } = useCourse();
  const { fetchSchools, schools, isLoading: loadingSchools } = useSchool();
  const { fetchPrograms, programs, isLoading: loadingPrograms } = useProgram();

  const searchParams = useSearchParams();

  useEffect(() => {
    fetchCourseById({
      courseId: searchParams.get('courseId') as string,
      withMetaData: true,
    });

    fetchPrograms({});
    fetchSchools({});
  }, []);

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    const keys = [
      COURSE_FORM_FIELDS.name.key,
      COURSE_FORM_FIELDS.description.key,
      COURSE_FORM_FIELDS.school.key,
      COURSE_FORM_FIELDS.program.key,
    ];

    let result = extractValuesFromFormEvent<TcourseFields>(e, keys);
    editCourse(result);
  };

  return (
    <>
      <AdminPageTitle title={i18next.t('edit_course')} />

      {course === null ? (
        <div className="flex items-center justify-center h-[400px]">
          <Spinner size="xl" />
        </div>
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
