'use client';

import { AdminFormInput } from '@components/admin/AdminForm/AdminFormInput';
import Autocomplete from '@components/atom/Autocomplete/Autocomplete';
import { AdminPageTitle } from '@components/layouts';
import { T_GradeFields } from '@hooks/useGrade/types';
import useSubject from '@hooks/useSubject';
import { T_CreateSubjectFields } from '@hooks/useSubject/types';
import { API_LINKS } from 'app/links';
import { Button, Spinner } from 'flowbite-react';
import i18next from 'i18next';
import { useToastMessage } from 'providers/ToastMessageContext';
import { FormEventHandler, useState } from 'react';
import { extractValuesFromFormEvent } from 'utils/helpers/extractValuesFromFormEvent';
import { SUBJECT_FORM_FIELDS } from './constants';

const CreateSubjectView = ({ onSuccessfullyDone }: { onSuccessfullyDone?: () => void }) => {
  const { createSubject, isLoading } = useSubject();
  const [gradeId, setGradeId] = useState<string | null>(null);
  const message = useToastMessage();

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    if (!gradeId) {
      message.error(`You need to provide a grade to create a subject.`);
      return;
    }

    const keys = [SUBJECT_FORM_FIELDS.name.key, SUBJECT_FORM_FIELDS.description.key];

    let result = extractValuesFromFormEvent<T_CreateSubjectFields>(e, keys);
    createSubject(
      {
        ...result,
        gradeId: gradeId as string,
      },
      onSuccessfullyDone,
    );
  };

  const handleClick = (grade: T_GradeFields) => {
    setGradeId(grade?._id);
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

        <Autocomplete url={API_LINKS.FIND_GRADE_BY_NAME} handleSelect={handleClick} moduleName="grades" />

        <Button type="submit" className="mt-2" disabled={isLoading}>
          {isLoading ? <Spinner size="sm" className="mr-3" /> : undefined}
          {i18next.t('submit')}
        </Button>
      </form>
    </>
  );
};

export default CreateSubjectView;
