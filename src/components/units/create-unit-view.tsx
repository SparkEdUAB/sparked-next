/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { AdminPageTitle } from '@components/layouts';
import useCourse from '@hooks/useCourse';
import useSchool from '@hooks/useSchool';
import SchoolStore from '@state/mobx/scholStore';
import { Button, Spinner } from 'flowbite-react';
import i18next from 'i18next';
import { FormEventHandler, useEffect } from 'react';
import { UNIT_FORM_FIELDS } from './constants';
import useProgram from '@hooks/useProgram';
import useUnit from '@hooks/useUnit';
import { extractValuesFromFormEvent } from 'utils/helpers';
import { TcreateUnitFields } from '@hooks/useUnit/types';
import { AdminFormSelector } from '../admin/AdminForm/AdminFormSelector';
import { AdminFormInput } from '../admin/AdminForm/AdminFormInput';

const onFinishFailed = (errorInfo: any) => {};

const CreateUnitView = ({ onSuccessfullyDone }: { onSuccessfullyDone?: () => void }) => {
  const { createUnit, isLoading } = useUnit();
  const { fetchSchools, schools, isLoading: loadingSchools } = useSchool();
  const { fetchPrograms, programs, isLoading: loadingPrograms } = useProgram();
  const { fetchCourses, courses, isLoading: loadingCourses } = useCourse();

  const { selectedSchool } = SchoolStore;

  useEffect(() => {
    fetchSchools({});
    fetchPrograms({});
    fetchCourses({});
  }, []);

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    const keys = [
      UNIT_FORM_FIELDS.name.key,
      UNIT_FORM_FIELDS.description.key,
      UNIT_FORM_FIELDS.school.key,
      UNIT_FORM_FIELDS.program.key,
      UNIT_FORM_FIELDS.course.key,
    ];

    let result = extractValuesFromFormEvent<TcreateUnitFields>(e, keys);
    createUnit(result, onSuccessfullyDone);
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
          loadingItems={loadingSchools}
          disabled={isLoading || loadingSchools}
          options={schools}
          label={UNIT_FORM_FIELDS.school.label}
          name={UNIT_FORM_FIELDS.school.key}
        />

        <AdminFormSelector
          loadingItems={loadingPrograms}
          disabled={isLoading || loadingPrograms}
          options={programs}
          label={UNIT_FORM_FIELDS.program.label}
          name={UNIT_FORM_FIELDS.program.key}
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
