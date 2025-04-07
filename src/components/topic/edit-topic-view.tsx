'use client';

import { AdminPageTitle } from '@components/layouts';
import { Spinner } from 'flowbite-react';
import i18next from 'i18next';
import { FormEventHandler, useEffect, useState } from 'react';
import { TOPIC_FORM_FIELDS } from './constants';
import useTopic from '@hooks/use-topic';
import { extractValuesFromFormEvent } from 'utils/helpers/extractValuesFromFormEvent';
import { T_TopicFields } from '@hooks/use-topic/types';
import { AdminFormInput } from '@components/admin/AdminForm/AdminFormInput';
import { API_LINKS } from 'app/links';
import { LibraryErrorMessage } from '@components/library/LibraryErrorMessage/LibraryErrorMessage';
import { DeletionWarningModal } from '@components/admin/AdminTable/DeletionWarningModal';
import SelectList from '@components/atom/SelectList/SelectList';
import { T_UnitWithoutMetadata } from '@hooks/useUnit/types';
import { UpdateButtons } from '@components/atom/UpdateButtons/UpdateButtons';
import { T_NameAndDescription } from 'types';
import { T_GradeWithoutMetadata } from '@hooks/useGrade/types';
import { T_SubjectWithoutMetadata } from '@hooks/useSubject/types';

const EditTopicView = ({ topic, onSuccessfullyDone }: { topic: T_TopicFields; onSuccessfullyDone: () => void }) => {
  const { editTopic, deleteTopics } = useTopic();
  const [uploading, setUploading] = useState(false);
  const [showDeletionWarning, setShowDeletionWarning] = useState(false);
  const [grade, setGrade] = useState<T_GradeWithoutMetadata | null>(null);
  const [subject, setSubject] = useState<T_SubjectWithoutMetadata | null>(null);
  const [unit, setUnit] = useState<T_UnitWithoutMetadata | null>(null);
  const toggleDeletionWarning = () => setShowDeletionWarning((value) => !value);

  // Initialize with existing data
  useEffect(() => {
    if (topic && topic.gradeId) {
      setGrade({ _id: topic.gradeId, name: topic.gradeName || '' } as T_GradeWithoutMetadata);
    }
  }, [topic]);

  // Set subject when grade is selected or initialized
  useEffect(() => {
    if (grade && topic && grade._id === topic.gradeId && topic.subjectId) {
      setSubject({
        _id: topic.subjectId,
        name: topic.subjectName || '',
        grade_id: topic.gradeId,
      } as T_SubjectWithoutMetadata);
    } else {
      setSubject(null);
      setUnit(null);
    }
  }, [grade, topic]);

  // Set unit when subject is selected or initialized
  useEffect(() => {
    if (subject && topic && subject._id === topic.subjectId && topic.unitId) {
      setUnit({
        _id: topic.unitId,
        name: topic.unitName || '',
        subject_id: topic.subjectId,
        grade_id: topic.gradeId,
      } as T_UnitWithoutMetadata);
    } else {
      setUnit(null);
    }
  }, [subject, topic]);

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    try {
      setUploading(true);
      e.preventDefault();

      const keys = [TOPIC_FORM_FIELDS.name.key, TOPIC_FORM_FIELDS.description.key];

      let result = extractValuesFromFormEvent<T_NameAndDescription>(e, keys);
      await editTopic(
        {
          ...topic,
          ...result,
          unitId: unit?._id || topic.unitId,
          subjectId: unit?.subject_id || topic.subjectId,
          gradeId: unit?.grade_id || topic.gradeId,
        },
        onSuccessfullyDone,
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <AdminPageTitle title={i18next.t('edit_topic')} />

      {topic === null ? (
        <div className="flex items-center justify-center h-[400px]">
          <Spinner size="xl" />
        </div>
      ) : topic instanceof Error ? (
        <LibraryErrorMessage>{topic.message}</LibraryErrorMessage>
      ) : (
        <form className="flex flex-col gap-4 max-w-xl" onSubmit={handleSubmit}>
          <AdminFormInput
            disabled={uploading}
            name={TOPIC_FORM_FIELDS.name.key}
            label={TOPIC_FORM_FIELDS.name.label}
            defaultValue={topic.name}
            required
          />

          <AdminFormInput
            disabled={uploading}
            name={TOPIC_FORM_FIELDS.description.key}
            label={TOPIC_FORM_FIELDS.description.label}
            defaultValue={topic.description}
            required
          />

          <SelectList<T_GradeWithoutMetadata>
            url={API_LINKS.FETCH_GRADES}
            handleSelect={setGrade}
            moduleName="grades"
            label="Grade"
            disabled={uploading}
            selectedItem={grade}
            placeholder="Select a grade"
            required
          />

          <SelectList<T_SubjectWithoutMetadata>
            url={API_LINKS.FETCH_SUBJECTS_BY_GRADE_ID}
            handleSelect={setSubject}
            moduleName="subjects"
            label="Subject"
            disabled={uploading || !grade}
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
            disabled={uploading || !subject}
            selectedItem={unit}
            placeholder={subject ? 'Select a unit' : 'Select a subject first'}
            queryParams={{ subjectId: subject?._id || '' }}
            required
          />

          <UpdateButtons uploading={uploading} toggleDeletionWarning={toggleDeletionWarning} />
        </form>
      )}

      <DeletionWarningModal
        showDeletionWarning={showDeletionWarning}
        toggleDeletionWarning={toggleDeletionWarning}
        deleteItems={async () => {
          try {
            setUploading(true);
            const successful = await deleteTopics([topic]);
            if (successful) {
              onSuccessfullyDone();
            }
          } finally {
            setUploading(false);
          }
        }}
        numberOfElements={1}
      />
    </>
  );
};

export default EditTopicView;
