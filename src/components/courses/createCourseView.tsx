/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { AdminPageTitle } from '@components/layouts';
import useCourse from '@hooks/useCourse';
import useSchool from '@hooks/useSchool';
import SchoolStore from '@state/mobx/scholStore';
import { Button, Spinner } from 'flowbite-react';
import i18next from 'i18next';
import { FormEventHandler, useEffect } from 'react';
import { COURSE_FORM_FIELDS } from './constants';
import useProgram from '@hooks/useProgram';
import { AdminFormInput } from '@components/admin/AdminForm/AdminFormInput';
import { AdminFormSelector } from '@components/admin/AdminForm/AdminFormSelector';
import { T_CreateUnitFields } from '@hooks/useUnit/types';
import { extractValuesFromFormEvent } from 'utils/helpers';

const CreateCourseView = ({ onSuccessfullyDone }: { onSuccessfullyDone?: () => void }) => {
  const { createCourse, isLoading } = useCourse();
  const { fetchSchools, schools, isLoading: loadingSchools } = useSchool();
  const { fetchPrograms, programs, isLoading: loadingPrograms } = useProgram();

  const { selectedSchool } = SchoolStore;

  useEffect(() => {
    fetchSchools({});
    fetchPrograms({});
  }, []);

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    const keys = [
      COURSE_FORM_FIELDS.name.key,
      COURSE_FORM_FIELDS.description.key,
      COURSE_FORM_FIELDS.school.key,
      COURSE_FORM_FIELDS.program.key,
    ];

    let result = extractValuesFromFormEvent<T_CreateUnitFields>(e, keys);
    createCourse(result, onSuccessfullyDone);
  };

  return (
    <>
      <AdminPageTitle title={i18next.t('create_course')} />

      <form className="flex flex-col gap-4 max-w-xl" onSubmit={handleSubmit}>
        <AdminFormInput
          disabled={isLoading}
          name={COURSE_FORM_FIELDS.name.key}
          label={COURSE_FORM_FIELDS.name.label}
          required
        />

        <AdminFormInput
          disabled={isLoading}
          name={COURSE_FORM_FIELDS.description.key}
          label={COURSE_FORM_FIELDS.description.label}
          required
        />

        <AdminFormSelector
          loadingItems={loadingSchools}
          disabled={isLoading || loadingSchools}
          options={schools}
          label={COURSE_FORM_FIELDS.school.label}
          name={COURSE_FORM_FIELDS.school.key}
        />

        <AdminFormSelector
          loadingItems={loadingPrograms}
          disabled={isLoading || loadingPrograms}
          options={programs}
          label={COURSE_FORM_FIELDS.program.label}
          name={COURSE_FORM_FIELDS.program.key}
        />

        <Button type="submit" className="mt-2" disabled={isLoading}>
          {isLoading ? <Spinner size="sm" className="mr-3" /> : undefined}
          {i18next.t('submit')}
        </Button>
      </form>
    </>
  );
};

export default CreateCourseView;
