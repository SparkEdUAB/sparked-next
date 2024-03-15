/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { AdminPageTitle } from '@components/layouts';
import useProgram from '@hooks/useProgram';
import { Button, Spinner } from 'flowbite-react';
import i18next from 'i18next';
import { useSearchParams } from 'next/navigation';
import { FormEventHandler, useEffect } from 'react';
import { PROGRAM_FORM_FIELDS } from './constants';
import useSchool from '@hooks/useSchool';
import { extractValuesFromFormEvent } from 'utils/helpers';
import { T_ProgramFields } from '@hooks/useProgram/types';
import { AdminFormInput } from '@components/admin/AdminForm/AdminFormInput';
import { AdminFormSelector } from '@components/admin/AdminForm/AdminFormSelector';

const EditProgramView = ({
  programId,
  onSuccessfullyDone,
}: {
  programId?: string;
  onSuccessfullyDone?: () => void;
}) => {
  const { editProgram, fetchProgramById, program, isLoading } = useProgram();
  const { fetchSchools, schools, isLoading: loadingSchools } = useSchool();

  const searchParams = useSearchParams();

  useEffect(() => {
    fetchProgramById({
      programId: programId || (searchParams.get('programId') as string),
      withMetaData: true,
    });

    fetchSchools({});
  }, []);

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    const keys = [PROGRAM_FORM_FIELDS.name.key, PROGRAM_FORM_FIELDS.description.key, PROGRAM_FORM_FIELDS.school.key];

    let result = extractValuesFromFormEvent<T_ProgramFields>(e, keys);
    editProgram(result, onSuccessfullyDone);
  };

  return (
    <>
      <AdminPageTitle title={i18next.t('edit_program')} />

      {program === null ? (
        <div className="flex items-center justify-center h-[400px]">
          <Spinner size="xl" />
        </div>
      ) : (
        <form className="flex flex-col items-start" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-4 max-w-xl w-full">
            <AdminFormInput
              disabled={isLoading}
              name={PROGRAM_FORM_FIELDS.name.key}
              label={PROGRAM_FORM_FIELDS.name.label}
              required
              defaultValue={program.name}
            />

            <AdminFormInput
              disabled={isLoading}
              name={PROGRAM_FORM_FIELDS.description.key}
              label={PROGRAM_FORM_FIELDS.description.label}
              required
              defaultValue={program.description}
            />

            <AdminFormSelector
              loadingItems={loadingSchools}
              disabled={isLoading || loadingSchools}
              options={schools}
              label={PROGRAM_FORM_FIELDS.school.label}
              name={PROGRAM_FORM_FIELDS.school.key}
              defaultValue={program.schoolId}
              required
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

export default EditProgramView;
