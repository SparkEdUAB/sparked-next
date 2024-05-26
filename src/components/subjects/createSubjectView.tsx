'use client';

import { AdminPageTitle } from '@components/layouts';
import useSubject from '@hooks/useSubject';
import { Button, Spinner } from 'flowbite-react';
import i18next from 'i18next';
import { FormEventHandler } from 'react';
import { SUBJECT_FORM_FIELDS } from './constants';
import { transformRawProgram } from '@hooks/useProgram';
import { AdminFormInput } from '@components/admin/AdminForm/AdminFormInput';
import { AdminFormSelector } from '@components/admin/AdminForm/AdminFormSelector';
import { extractValuesFromFormEvent } from 'utils/helpers';
import { T_CreateSubjectFields } from '@hooks/useSubject/types';
import { useAdminListViewData } from '@hooks/useAdmin/useAdminListViewData';
import { API_LINKS } from 'app/links';

const CreateSubjectView = ({ onSuccessfullyDone }: { onSuccessfullyDone?: () => void }) => {
  const { createSubject, isLoading } = useSubject();

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    const keys = [SUBJECT_FORM_FIELDS.name.key, SUBJECT_FORM_FIELDS.description.key];

    let result = extractValuesFromFormEvent<Omit<T_CreateSubjectFields, 'schoolId'>>(e, keys);
    createSubject(
      {
        ...result,
      },
      onSuccessfullyDone,
    );
  };

  return (
    <>
      <AdminPageTitle title={i18next.t('create_subject')} />

      <form className="flex flex-col gap-4 max-w-xl" onSubmit={handleSubmit}>
        <AdminFormInput
          disabled={isLoading}
          name={SUBJECT_FORM_FIELDS.name.key}
          label={SUBJECT_FORM_FIELDS.name.label}
          required
        />

        <AdminFormInput
          disabled={isLoading}
          name={SUBJECT_FORM_FIELDS.description.key}
          label={SUBJECT_FORM_FIELDS.description.label}
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

export default CreateSubjectView;
