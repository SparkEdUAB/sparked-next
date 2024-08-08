'use client';

import { AdminPageTitle } from '@components/layouts';
import useProgram, { transformRawProgram } from '@hooks/useProgram';
import { Button, Spinner } from 'flowbite-react';
import i18next from 'i18next';
import { useSearchParams } from 'next/navigation';
import { FormEventHandler } from 'react';
import { PROGRAM_FORM_FIELDS } from './constants';
import { transformRawSchool } from '@hooks/useSchool';
import { extractValuesFromFormEvent } from 'utils/helpers/extractValuesFromFormEvent';
import { T_CreateProgramFields } from '@hooks/useProgram/types';
import { AdminFormInput } from '@components/admin/AdminForm/AdminFormInput';
import { AdminFormSelector } from '@components/admin/AdminForm/AdminFormSelector';
import { API_LINKS } from 'app/links';
import { useAdminListViewData } from '@hooks/useAdmin/useAdminListViewData';
import { useAdminItemById } from '@hooks/useAdmin/useAdminItemById';
import { LibraryErrorMessage } from '@components/library/LibraryErrorMessage/LibraryErrorMessage';
import { useToastMessage } from 'providers/ToastMessageContext';

const EditProgramView = ({
  programId,
  onSuccessfullyDone,
}: {
  programId?: string;
  onSuccessfullyDone?: () => void;
}) => {
  const { editProgram } = useProgram();
  const message = useToastMessage();
  const searchParams = useSearchParams();

  const { item: program, isLoading } = useAdminItemById(
    API_LINKS.FETCH_PROGRAM_BY_ID,
    programId || (searchParams.get('programId') as string),
    'program',
    transformRawProgram,
  );

  const { items: schools, isLoading: loadingSchools } = useAdminListViewData(
    API_LINKS.FETCH_SCHOOLS,
    'schools',
    transformRawSchool,
  );

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    if (!program || program instanceof Error) {
      return message.error('Program is empty');
    }

    const keys = [PROGRAM_FORM_FIELDS.name.key, PROGRAM_FORM_FIELDS.description.key, PROGRAM_FORM_FIELDS.school.key];

    let result = extractValuesFromFormEvent<T_CreateProgramFields>(e, keys);
    editProgram({ ...program, ...result }, onSuccessfullyDone);
  };

  return (
    <>
      <AdminPageTitle title={i18next.t('edit_program')} />

      {program === null ? (
        <div className="flex items-center justify-center h-[400px]">
          <Spinner size="xl" />
        </div>
      ) : program instanceof Error ? (
        <LibraryErrorMessage>{program.message}</LibraryErrorMessage>
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
              {i18next.t('update')}
            </Button>
          </div>
        </form>
      )}
    </>
  );
};

export default EditProgramView;
