/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { AdminPageTitle } from '@components/layouts';
import useProgram from '@hooks/useProgram';
import { Button, Spinner } from 'flowbite-react';
import i18next from 'i18next';
import { useSearchParams } from 'next/navigation';
import { FormEventHandler, useEffect } from 'react';
import { UNIT_FORM_FIELDS } from './constants';
import useSchool from '@hooks/useSchool';
import useUnit from '@hooks/useUnit';
import useCourse from '@hooks/useCourse';
import { AdminFormInput } from '@components/admin/AdminForm/AdminFormInput';
import { AdminFormSelector } from '@components/admin/AdminForm/AdminFormSelector';
import { T_UnitFields } from '@hooks/useUnit/types';
import { extractValuesFromFormEvent } from 'utils/helpers';

const EditUnitView = ({ unitId, onSuccessfullyDone }: { unitId?: string; onSuccessfullyDone?: () => void }) => {
  // const [form] = Form.useForm();
  const { editUnit, fetchUnitById, unit, isLoading } = useUnit();
  const { fetchSchools, schools, isLoading: loadingSchools } = useSchool();
  const { fetchPrograms, programs, isLoading: loadingPrograms } = useProgram();
  const { fetchCourses, courses, isLoading: loadingCourses } = useCourse();

  const searchParams = useSearchParams();

  useEffect(() => {
    fetchUnitById({
      unitId: unitId || (searchParams.get('unitId') as string),
      withMetaData: true,
    });

    fetchPrograms({});
    fetchSchools({});
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

    let result = extractValuesFromFormEvent<T_UnitFields>(e, keys);
    editUnit(result, onSuccessfullyDone);
  };

  return (
    <>
      <AdminPageTitle title={i18next.t('edit_unit')} />

      {unit === null ? (
        <div className="flex items-center justify-center h-[400px]">
          <Spinner size="xl" />
        </div>
      ) : (
        <form className="flex flex-col items-start" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-4 md:max-w-xl w-full">
            <AdminFormInput
              disabled={isLoading}
              name={UNIT_FORM_FIELDS.name.key}
              label={UNIT_FORM_FIELDS.name.label}
              required
              defaultValue={unit.name}
            />

            <AdminFormInput
              disabled={isLoading}
              name={UNIT_FORM_FIELDS.description.key}
              label={UNIT_FORM_FIELDS.description.label}
              required
              defaultValue={unit.description}
            />

            <AdminFormSelector
              loadingItems={loadingSchools}
              disabled={isLoading || loadingSchools}
              options={schools}
              label={UNIT_FORM_FIELDS.school.label}
              name={UNIT_FORM_FIELDS.school.key}
              defaultValue={unit.schoolId}
            />

            <AdminFormSelector
              loadingItems={loadingPrograms}
              disabled={isLoading || loadingPrograms}
              options={programs}
              label={UNIT_FORM_FIELDS.program.label}
              name={UNIT_FORM_FIELDS.program.key}
              defaultValue={unit.programId}
            />

            <AdminFormSelector
              loadingItems={loadingCourses}
              disabled={isLoading || loadingCourses}
              options={courses}
              label={UNIT_FORM_FIELDS.course.label}
              name={UNIT_FORM_FIELDS.course.key}
              defaultValue={unit.courseId}
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

export default EditUnitView;
