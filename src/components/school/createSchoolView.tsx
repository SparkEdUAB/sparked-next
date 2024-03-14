/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import useSchool from '@hooks/useSchool';
import { Button, Spinner } from 'flowbite-react';
import i18next from 'i18next';
import { SCHOOL_FORM_FIELDS } from './constants';
import { AdminPageTitle } from '@components/layouts';
import SchoolStore from '@state/mobx/scholStore';
import { FormEventHandler } from 'react';
import { extractValuesFromFormEvent } from 'utils/helpers';
import { TschoolFields } from './types';
import { AdminFormInput } from '@components/admin/AdminForm/AdminFormInput';

const onFinishFailed = (errorInfo: any) => {};

const CreateSchoolView = ({ onSuccessfullyDone }: { onSuccessfullyDone?: () => void }) => {
  const { createSchool, isLoading } = useSchool();

  const { selectedSchool } = SchoolStore;

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    const keys = [SCHOOL_FORM_FIELDS.name.key, SCHOOL_FORM_FIELDS.description.key];

    let result = extractValuesFromFormEvent<TschoolFields>(e, keys);
    createSchool(result, onSuccessfullyDone);
  };

  // const [form] = Form.useForm();

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
