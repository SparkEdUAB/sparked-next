/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { AdminPageTitle } from '@components/layouts';
import { Button, Spinner } from 'flowbite-react';
import i18next from 'i18next';
import { useSearchParams } from 'next/navigation';
import { FormEventHandler, useEffect } from 'react';
import { TOPIC_FORM_FIELDS } from './constants';
import useProgram from '@hooks/useProgram';
import useSchool, { transformRawSchool } from '@hooks/useSchool';
import useUnit, { transformRawUnit } from '@hooks/useUnit';
import useCourse, { transformRawCourse } from '@hooks/useCourse';
import useTopic, { transformRawTopic } from '@hooks/use-topic';
import { extractValuesFromFormEvent } from 'utils/helpers';
import { T_TopicFields } from '@hooks/use-topic/types';
import { AdminFormSelector } from '@components/admin/AdminForm/AdminFormSelector';
import { AdminFormInput } from '@components/admin/AdminForm/AdminFormInput';
import { useAdminListViewData } from '@hooks/useAdmin/useAdminListViewData';
import { API_LINKS } from 'app/links';
import { useAdminItemById } from '@hooks/useAdmin/useAdminItemById';
import { LibraryErrorMessage } from '@components/library/LibraryErrorMessage/LibraryErrorMessage';

const EditTopicView = ({ topicId, onSuccessfullyDone }: { topicId?: string; onSuccessfullyDone?: () => void }) => {
  const { editTopic } = useTopic();

  const searchParams = useSearchParams();

  const { item: topic, isLoading } = useAdminItemById(
    API_LINKS.FETCH_TOPIC_BY_ID,
    topicId || (searchParams.get('topicId') as string),
    'topic',
    transformRawTopic,
  );

  const { items: units, isLoading: loadingUnits } = useAdminListViewData(
    API_LINKS.FETCH_UNITS,
    'units',
    transformRawUnit,
  );

  const { items: courses, isLoading: loadingCourses } = useAdminListViewData(
    API_LINKS.FETCH_COURSES,
    'courses',
    transformRawCourse,
  );

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    const keys = [
      TOPIC_FORM_FIELDS.name.key,
      TOPIC_FORM_FIELDS.description.key,
      TOPIC_FORM_FIELDS.school.key,
      TOPIC_FORM_FIELDS.program.key,
      TOPIC_FORM_FIELDS.course.key,
      TOPIC_FORM_FIELDS.unit.key,
    ];

    let result = extractValuesFromFormEvent<T_TopicFields>(e, keys);
    editTopic(result, onSuccessfullyDone);
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
            disabled={isLoading}
            name={TOPIC_FORM_FIELDS.name.key}
            label={TOPIC_FORM_FIELDS.name.label}
            defaultValue={topic.name}
            required
          />

          <AdminFormInput
            disabled={isLoading}
            name={TOPIC_FORM_FIELDS.description.key}
            label={TOPIC_FORM_FIELDS.description.label}
            defaultValue={topic.description}
            required
          />

          <AdminFormSelector
            loadingItems={loadingCourses}
            disabled={isLoading || loadingCourses}
            options={courses}
            label={TOPIC_FORM_FIELDS.course.label}
            name={TOPIC_FORM_FIELDS.course.key}
            defaultValue={topic.courseId}
          />

          <AdminFormSelector
            loadingItems={loadingUnits}
            disabled={isLoading || loadingUnits}
            options={units}
            label={TOPIC_FORM_FIELDS.unit.label}
            name={TOPIC_FORM_FIELDS.unit.key}
            defaultValue={topic.unitId}
          />

          <Button type="submit" className="mt-2" disabled={isLoading}>
            {isLoading ? <Spinner size="sm" className="mr-3" /> : undefined}
            {i18next.t('submit')}
          </Button>
        </form>
      )}
    </>
  );
};

export default EditTopicView;
