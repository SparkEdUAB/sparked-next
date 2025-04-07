'use client';

import { AdminPageTitle } from '@components/layouts';
import useTopic from '@hooks/use-topic';
import { Button, Spinner } from 'flowbite-react';
import i18next from 'i18next';
import { FormEventHandler, useEffect, useState } from 'react';
import { TOPIC_FORM_FIELDS } from './constants';
import { AdminFormInput } from '@components/admin/AdminForm/AdminFormInput';
import { extractValuesFromFormEvent } from 'utils/helpers/extractValuesFromFormEvent';
import { T_CreateTopicFields } from '@hooks/use-topic/types';
import { API_LINKS } from 'app/links';
import SelectList from '@components/atom/SelectList/SelectList';
import { T_UnitWithoutMetadata } from '@hooks/useUnit/types';
import { T_GradeWithoutMetadata } from '@hooks/useGrade/types';
import { T_SubjectWithoutMetadata } from '@hooks/useSubject/types';
import { useToastMessage } from 'providers/ToastMessageContext';

const CreateTopicView = ({ onSuccessfullyDone }: { onSuccessfullyDone?: () => void }) => {
  const { createTopic, isLoading } = useTopic();
  const message = useToastMessage();
  const [grade, setGrade] = useState<T_GradeWithoutMetadata | null>(null);
  const [subject, setSubject] = useState<T_SubjectWithoutMetadata | null>(null);
  const [unit, setUnit] = useState<T_UnitWithoutMetadata | null>(null);

  // Reset dependent selections when parent selection changes
  useEffect(() => {
    setSubject(null);
    setUnit(null);
  }, [grade]);

  useEffect(() => {
    setUnit(null);
  }, [subject]);

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    if (!unit) {
      message.error(`You need to provide a unit to create a topic.`);
      return;
    }

    const keys = [TOPIC_FORM_FIELDS.name.key, TOPIC_FORM_FIELDS.description.key];

    let result = extractValuesFromFormEvent<Omit<T_CreateTopicFields, 'schoolId' | 'programId' | 'courseId'>>(e, keys);

    createTopic(
      {
        ...result,
        unitId: unit._id,
        subjectId: unit.subject_id,
        gradeId: unit.grade_id,
      },
      onSuccessfullyDone,
    );
  };

  return (
    <>
      <AdminPageTitle title={i18next.t('create_topic')} />

      <form className="flex flex-col gap-4 max-w-xl" onSubmit={handleSubmit}>
        <AdminFormInput
          disabled={isLoading}
          name={TOPIC_FORM_FIELDS.name.key}
          label={TOPIC_FORM_FIELDS.name.label}
          required
        />

        <AdminFormInput
          disabled={isLoading}
          name={TOPIC_FORM_FIELDS.description.key}
          label={TOPIC_FORM_FIELDS.description.label}
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

        <SelectList<T_UnitWithoutMetadata>
          url={API_LINKS.FETCH_UNITS_BY_SUBJECT_ID}
          handleSelect={setUnit}
          moduleName="units"
          label="Unit"
          disabled={isLoading || !subject}
          selectedItem={unit}
          placeholder={subject ? 'Select a unit' : 'Select a subject first'}
          queryParams={{ subjectId: subject?._id || '' }}
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

export default CreateTopicView;
