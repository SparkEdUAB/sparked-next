/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { AdminPageTitle } from '@components/layouts';
import { Button, Spinner } from 'flowbite-react';
import i18next from 'i18next';

import { FormEventHandler, useState } from 'react';
import { TOPIC_FORM_FIELDS } from './constants';

import { transformRawUnit } from '@hooks/useUnit';
import { transformRawCourse } from '@hooks/useCourse';
import useTopic from '@hooks/use-topic';
import { extractValuesFromFormEvent } from 'utils/helpers';
import { T_TopicFields } from '@hooks/use-topic/types';
import { AdminFormSelector } from '@components/admin/AdminForm/AdminFormSelector';
import { AdminFormInput } from '@components/admin/AdminForm/AdminFormInput';
import { useAdminListViewData } from '@hooks/useAdmin/useAdminListViewData';
import { API_LINKS } from 'app/links';
import { useAdminItemById } from '@hooks/useAdmin/useAdminItemById';
import { LibraryErrorMessage } from '@components/library/LibraryErrorMessage/LibraryErrorMessage';
import { DeletionWarningModal } from '@components/admin/AdminTable/DeletionWarningModal';
import Autocomplete from '@components/atom/Autocomplete/Autocomplete';
import { T_UnitFields } from '@hooks/useUnit/types';

const EditTopicView = ({ topic, onSuccessfullyDone }: { topic: T_TopicFields; onSuccessfullyDone: () => void }) => {
  const { editTopic, deleteTopics } = useTopic();
  const [uploading, setUploading] = useState(false);
  const [showDeletionWarning, setShowDeletionWarning] = useState(false);
  const [unitId, setUnitId] = useState<string | null>(null);
  const toggleDeletionWarning = () => setShowDeletionWarning((value) => !value);

  const { item: unit, isLoading: loadingUnits } = useAdminItemById(
    API_LINKS.FETCH_UNIT_BY_ID,
    topic.unitId as string,
    'unit',
    transformRawUnit,
  );

  const { items: courses, isLoading: loadingCourses } = useAdminListViewData(
    API_LINKS.FETCH_COURSES,
    'courses',
    transformRawCourse,
  );

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    try {
      setUploading(true);
      e.preventDefault();

      const keys = [TOPIC_FORM_FIELDS.name.key, TOPIC_FORM_FIELDS.description.key, TOPIC_FORM_FIELDS.course.key];

      let result = extractValuesFromFormEvent<T_TopicFields>(e, keys);
      await editTopic({ ...topic, ...result, unitId: unitId as string }, onSuccessfullyDone);
    } finally {
      setUploading(false);
    }
  };

  const handleClick = (unit: T_UnitFields) => {
    setUnitId(unit?._id);
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

          <AdminFormSelector
            loadingItems={loadingCourses}
            disabled={uploading || loadingCourses}
            options={courses}
            label={TOPIC_FORM_FIELDS.course.label}
            name={TOPIC_FORM_FIELDS.course.key}
            defaultValue={topic.courseId}
          />
          <Autocomplete
            url={API_LINKS.FIND_UNITS_BY_NAME}
            handleSelect={handleClick}
            defaultValue={unit?.name}
            moduleName="units"
          />

          <Button type="submit" className="mt-2" disabled={uploading}>
            {uploading ? <Spinner size="sm" className="mr-3" /> : undefined}
            {i18next.t('update')}
          </Button>

          <Button color="red" onClick={toggleDeletionWarning} disabled={uploading}>
            {uploading ? <Spinner size="sm" className="mr-3" /> : undefined}
            {i18next.t('delete')}
          </Button>
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
