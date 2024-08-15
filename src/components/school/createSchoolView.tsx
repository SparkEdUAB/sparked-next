/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import useSchool from '@hooks/useSchool';
import { Button, Spinner } from 'flowbite-react';
import i18next from 'i18next';
import { SCHOOL_FORM_FIELDS } from './constants';
import { AdminPageTitle } from '@components/layouts';
import { FormEventHandler } from 'react';
import { extractValuesFromFormEvent } from 'utils/helpers/extractValuesFromFormEvent';
import { T_SchoolFields } from './types';
import { AdminFormInput } from '@components/admin/AdminForm/AdminFormInput';
import { T_CreateSchoolFields } from '@hooks/useSchool/types';

const CreateSchoolView = ({ onSuccessfullyDone }: { onSuccessfullyDone?: () => void }) => {
  const { createSchool, isLoading } = useSchool();

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    const keys = [SCHOOL_FORM_FIELDS.name.key, SCHOOL_FORM_FIELDS.description.key];

    let result = extractValuesFromFormEvent<T_CreateSchoolFields>(e, keys);
    createSchool(result, onSuccessfullyDone);
  };

  return (
    <>
      <AdminPageTitle title={i18next.t('create_school')} />

      <form className="flex flex-col gap-4 max-w-xl" onSubmit={handleSubmit}>
        <AdminFormInput
          disabled={isLoading}
          name={SCHOOL_FORM_FIELDS.name.key}
          label={SCHOOL_FORM_FIELDS.name.label}
          required
        />

        <AdminFormInput
          disabled={isLoading}
          name={SCHOOL_FORM_FIELDS.description.key}
          label={SCHOOL_FORM_FIELDS.description.label}
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

export default CreateSchoolView;
