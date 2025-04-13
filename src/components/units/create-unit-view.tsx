'use client';

import { AdminPageTitle } from '@components/layouts';
import { Button, Spinner } from 'flowbite-react';
import i18next from 'i18next';
import { FormEventHandler, useEffect, useState } from 'react';
import { UNIT_FORM_FIELDS } from './constants';
import useUnit from '@hooks/useUnit';
import { extractValuesFromFormEvent } from 'utils/helpers/extractValuesFromFormEvent';
import { T_CreateUnitFields } from '@hooks/useUnit/types';
import { AdminFormInput } from '../admin/AdminForm/AdminFormInput';
import { API_LINKS } from 'app/links';
import SelectList from '@components/atom/SelectList/SelectList';
import { T_SubjectWithoutMetadata } from '@hooks/useSubject/types';
import { T_GradeWithoutMetadata } from '@hooks/useGrade/types';
import { useToastMessage } from 'providers/ToastMessageContext';

const CreateUnitView = ({ onSuccessfullyDone }: { onSuccessfullyDone?: () => void }) => {
  const { createUnit, isLoading } = useUnit();
  const message = useToastMessage();
  const [grade, setGrade] = useState<T_GradeWithoutMetadata | null>(null);
  const [subject, setSubject] = useState<T_SubjectWithoutMetadata | null>(null);

  // Reset subject when grade changes
  useEffect(() => {
    setSubject(null);
  }, [grade]);

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    if (!subject) {
      message.error(`You need to provide a subject to create a unit.`);
      return;
    }

    const keys = [UNIT_FORM_FIELDS.name.key, UNIT_FORM_FIELDS.description.key];

    let result = extractValuesFromFormEvent<Omit<T_CreateUnitFields, 'schoolId' | 'programId'>>(e, keys);
    createUnit(
      { ...result, subjectId: subject._id as string, gradeId: subject.grade_id as string },
      onSuccessfullyDone,
    );
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

        <SelectList<T_GradeWithoutMetadata>
          url={API_LINKS.FETCH_GRADES}
          handleSelect={setGrade}
          moduleName="grades"
          label="Grade"
          disabled={isLoading}
          selectedItem={grade}
          placeholder="Select a grade"
          required
        />

        <SelectList<T_SubjectWithoutMetadata>
          url={API_LINKS.FETCH_SUBJECTS_BY_GRADE_ID}
          handleSelect={setSubject}
          moduleName="subjects"
          label="Subject"
          disabled={isLoading || !grade}
          selectedItem={subject}
          placeholder={grade ? 'Select a subject' : 'Select a grade first'}
          queryParams={{ gradeId: grade?._id || '' }}
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

export default CreateUnitView;
