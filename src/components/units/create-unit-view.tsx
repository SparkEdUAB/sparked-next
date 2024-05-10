/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { AdminPageTitle } from '@components/layouts';
import { transformRawCourse } from '@hooks/useCourse';
import { Button, Spinner } from 'flowbite-react';
import i18next from 'i18next';
import { FormEventHandler } from 'react';
import { UNIT_FORM_FIELDS } from './constants';
import useUnit from '@hooks/useUnit';
import { extractValuesFromFormEvent } from 'utils/helpers';
import { T_CreateUnitFields } from '@hooks/useUnit/types';
import { AdminFormSelector } from '../admin/AdminForm/AdminFormSelector';
import { AdminFormInput } from '../admin/AdminForm/AdminFormInput';
import { useAdminListViewData } from '@hooks/useAdmin/useAdminListViewData';
import { API_LINKS } from 'app/links';

const CreateUnitView = ({ onSuccessfullyDone }: { onSuccessfullyDone?: () => void }) => {
  const { createUnit, isLoading } = useUnit();

  const { items: courses, isLoading: loadingCourses } = useAdminListViewData(
    API_LINKS.FETCH_COURSES,
    'courses',
    transformRawCourse,
  );

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    const keys = [UNIT_FORM_FIELDS.name.key, UNIT_FORM_FIELDS.description.key, UNIT_FORM_FIELDS.course.key];

    let result = extractValuesFromFormEvent<Omit<T_CreateUnitFields, 'schoolId' | 'programId'>>(e, keys);
    let course = courses.find((course) => course._id === result.courseId);
    createUnit({ ...result, programId: course?.programId, schoolId: course?.schoolId }, onSuccessfullyDone);
  };

  return (
    <>
      <AdminPageTitle title={i18next.t('create_unit')} />

      <form className="flex flex-col gap-4 max-w-xl" onSubmit={handleSubmit}>
        <AdminFormInput
          disabled={isLoading}
          name={UNIT_FORM_FIELDS.name.key}
          label={UNIT_FORM_FIELDS.name.label}
          required
        />

        <AdminFormInput
          disabled={isLoading}
          name={UNIT_FORM_FIELDS.description.key}
          label={UNIT_FORM_FIELDS.description.label}
          required
        />

        <AdminFormSelector
          loadingItems={loadingCourses}
          disabled={isLoading || loadingCourses}
          options={courses}
          label={UNIT_FORM_FIELDS.course.label}
          name={UNIT_FORM_FIELDS.course.key}
        />

        <Button type="submit" className="mt-2" disabled={isLoading}>
          {isLoading ? <Spinner size="sm" className="mr-3" /> : undefined}
          {i18next.t('submit')}
        </Button>
      </form>
    </>
  );
};

export default CreateUnitView;
