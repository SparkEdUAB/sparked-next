/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { transformRawSchool } from '@hooks/useSchool';
import { Button, Spinner } from 'flowbite-react';
import i18next from 'i18next';
import { AdminPageTitle } from '@components/layouts';
import { FormEventHandler } from 'react';
import useProgram from '@hooks/useProgram';
import { T_CreateProgramFields } from '@hooks/useProgram/types';
import { extractValuesFromFormEvent } from 'utils/helpers/extractValuesFromFormEvent';
import { PROGRAM_FORM_FIELDS } from './constants';
import { AdminFormInput } from '@components/admin/AdminForm/AdminFormInput';
import { AdminFormSelector } from '@components/admin/AdminForm/AdminFormSelector';
import { useAdminListViewData } from '@hooks/useAdmin/useAdminListViewData';
import { API_LINKS } from 'app/links';

const CreateProgramView = ({ onSuccessfullyDone }: { onSuccessfullyDone?: () => void }) => {
  const { createProgram, isLoading } = useProgram();

  const { items: schools, isLoading: loadingSchools } = useAdminListViewData(
    API_LINKS.FETCH_SCHOOLS,
    'schools',
    transformRawSchool,
  );

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    const keys = [PROGRAM_FORM_FIELDS.name.key, PROGRAM_FORM_FIELDS.description.key, PROGRAM_FORM_FIELDS.school.key];

    let result = extractValuesFromFormEvent<T_CreateProgramFields>(e, keys);
    createProgram(result, onSuccessfullyDone);
  };

  return (
    <>
      <AdminPageTitle title={i18next.t('create_program')} />

      <form className="flex flex-col gap-4 max-w-xl" onSubmit={handleSubmit}>
        <AdminFormInput
          disabled={isLoading}
          name={PROGRAM_FORM_FIELDS.name.key}
          label={PROGRAM_FORM_FIELDS.name.label}
          required
        />

        <AdminFormInput
          disabled={isLoading}
          name={PROGRAM_FORM_FIELDS.description.key}
          label={PROGRAM_FORM_FIELDS.description.label}
          required
        />

        <AdminFormSelector
          loadingItems={loadingSchools}
          disabled={isLoading || loadingSchools}
          options={schools}
          label={PROGRAM_FORM_FIELDS.school.label}
          name={PROGRAM_FORM_FIELDS.school.key}
          required
        />

        <Button type="submit" className="mt-2" disabled={isLoading}>
          {isLoading ? <Spinner size="sm" className="mr-3" /> : undefined}
          {i18next.t('submit')}
        </Button>
      </form>
    </>
  );
};

export default CreateProgramView;
