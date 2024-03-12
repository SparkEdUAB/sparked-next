/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { AdminPageTitle } from '@components/layouts';
import useProgram from '@hooks/useProgram';
import { Card, Col, Form, Input, Row, Select } from 'antd';
import { Button, Spinner } from 'flowbite-react';
import i18next from 'i18next';
import { useSearchParams } from 'next/navigation';
import { FormEventHandler, useEffect } from 'react';
import { TOPIC_FORM_FIELDS } from './constants';
import useSchool from '@hooks/useSchool';
import useUnit from '@hooks/useUnit';
import useCourse from '@hooks/useCourse';
import useTopic from '@hooks/use-topic';
import { extractValuesFromFormEvent } from 'utils/helpers';
import { T_topicFields } from '@hooks/use-topic/types';
import { AdminFormSelector } from '@components/admin/AdminForm/AdminFormSelector';
import { AdminFormInput } from '@components/admin/AdminForm/AdminFormInput';

const EditTopicView: React.FC = () => {
  const { editTopic, fetchTopicById, topic, isLoading } = useTopic();
  const { fetchUnits, units, isLoading: loadingUnits } = useUnit();
  const { fetchSchools, schools, isLoading: loadingSchools } = useSchool();
  const { fetchPrograms, programs, isLoading: loadingPrograms } = useProgram();
  const { fetchCourses, courses, isLoading: loadingCourses } = useCourse();

  const searchParams = useSearchParams();

  useEffect(() => {
    fetchTopicById({
      topicId: searchParams.get('topicId') as string,
      withMetaData: true,
    });

    fetchPrograms({});
    fetchSchools({});
    fetchCourses({});
    fetchUnits({});
  }, []);

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

    let result = extractValuesFromFormEvent<T_topicFields>(e, keys);
    editTopic(result);
  };

  return (
    <>
      <AdminPageTitle title={i18next.t('edit_topic')} />

      {topic === null ? (
        <div className="flex items-center justify-center h-[400px]">
          <Spinner size="xl" />
        </div>
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
            loadingItems={loadingSchools}
            disabled={isLoading || loadingSchools}
            options={schools}
            label={TOPIC_FORM_FIELDS.school.label}
            name={TOPIC_FORM_FIELDS.school.key}
            defaultValue={topic.schoolId}
          />

          <AdminFormSelector
            loadingItems={loadingPrograms}
            disabled={isLoading || loadingPrograms}
            options={programs}
            label={TOPIC_FORM_FIELDS.program.label}
            name={TOPIC_FORM_FIELDS.program.key}
            defaultValue={topic.programId}
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
