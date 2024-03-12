/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { AdminPageTitle } from '@components/layouts';
import useSchool from '@hooks/useSchool';
import { Card, Col, Form, Input, Row } from 'antd';
import { Button, Spinner } from 'flowbite-react';
import i18next from 'i18next';
import { useSearchParams } from 'next/navigation';
import { FormEventHandler, useEffect } from 'react';
import { SCHOOL_FORM_FIELDS } from './constants';
import { extractValuesFromFormEvent } from 'utils/helpers';
import { TschoolFields } from './types';
import { AdminFormInput } from '@components/admin/AdminForm/AdminFormInput';

const onFinishFailed = (errorInfo: any) => {};

const EditSchoolView: React.FC = () => {
  // const [form] = Form.useForm();
  const { editSchool, fetchSchool, school, isLoading } = useSchool();

  const searchParams = useSearchParams();

  useEffect(() => {
    fetchSchool(searchParams.get('schoolId') as string);
  }, []);

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    const keys = [SCHOOL_FORM_FIELDS.name.key, SCHOOL_FORM_FIELDS.description.key];

    let result = extractValuesFromFormEvent<TschoolFields>(e, keys);
    editSchool(result);
  };

  return (
    <>
      <AdminPageTitle title={i18next.t('edit_school')} />

      {school === null ? (
        <div className="flex items-center justify-center h-[400px]">
          <Spinner size="xl" />
        </div>
      ) : (
        <form className="flex flex-col items-start" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-4 max-w-xl w-full">
            <AdminFormInput
              disabled={isLoading}
              name={SCHOOL_FORM_FIELDS.name.key}
              label={SCHOOL_FORM_FIELDS.name.label}
              required
              defaultValue={school.name}
            />

            <AdminFormInput
              disabled={isLoading}
              name={SCHOOL_FORM_FIELDS.description.key}
              label={SCHOOL_FORM_FIELDS.description.label}
              required
              defaultValue={school.description}
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

export default EditSchoolView;
