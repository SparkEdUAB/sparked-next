/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { AdminPageTitle } from '@components/layouts';
import useCourse from '@hooks/useCourse';
import useProgram from '@hooks/useProgram';
import useSchool from '@hooks/useSchool';
import useTopic from '@hooks/use-topic';
import SchoolStore from '@state/mobx/scholStore';
import { Button, Spinner } from 'flowbite-react';
import i18next from 'i18next';
import { FormEventHandler, useEffect } from 'react';
import { TOPIC_FORM_FIELDS } from './constants';
import useUnit from '@hooks/useUnit';
import { AdminFormInput } from '@components/admin/AdminForm/AdminFormInput';
import { AdminFormSelector } from '@components/admin/AdminForm/AdminFormSelector';
import { extractValuesFromFormEvent } from 'utils/helpers';
import { T_CreateTopicFields } from '@hooks/use-topic/types';

const CreateTopicView = ({ onSuccessfullyDone }: { onSuccessfullyDone?: () => void }) => {
  const { createTopic, isLoading } = useTopic();
  // const { fetchSchools, schools, isLoading: loadingSchools } = useSchool();
  // const { fetchPrograms, programs, isLoading: loadingPrograms } = useProgram();
  // const { fetchCourses, courses, isLoading: loadingCourses } = useCourse();
  const { fetchUnits, units, isLoading: loadingUnits } = useUnit();

  const { selectedSchool } = SchoolStore;

  useEffect(() => {
    // fetchSchools({});
    // fetchPrograms({});
    // fetchCourses({});
    fetchUnits({});
  }, []);

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    const keys = [
      TOPIC_FORM_FIELDS.name.key,
      TOPIC_FORM_FIELDS.description.key,
      // TOPIC_FORM_FIELDS.school.key,
      // TOPIC_FORM_FIELDS.program.key,
      // TOPIC_FORM_FIELDS.course.key,
      TOPIC_FORM_FIELDS.unit.key,
    ];

    let result = extractValuesFromFormEvent<Omit<T_CreateTopicFields, 'schoolId' | 'programId' | 'courseId'>>(e, keys);
    let unit = units.find((unit) => unit._id === result.unitId);
    createTopic(
      { ...result, programId: unit?.programId, courseId: unit?.courseId, schoolId: unit?.schoolId },
      onSuccessfullyDone,
    );
  };

  // const [form] = Form.useForm();

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

        {/* <AdminFormSelector
          loadingItems={loadingSchools}
          disabled={isLoading || loadingSchools}
          options={schools}
          label={TOPIC_FORM_FIELDS.school.label}
          name={TOPIC_FORM_FIELDS.school.key}
        />

        <AdminFormSelector
          loadingItems={loadingPrograms}
          disabled={isLoading || loadingPrograms}
          options={programs}
          label={TOPIC_FORM_FIELDS.program.label}
          name={TOPIC_FORM_FIELDS.program.key}
        />

        <AdminFormSelector
          loadingItems={loadingCourses}
          disabled={isLoading || loadingCourses}
          options={courses}
          label={TOPIC_FORM_FIELDS.course.label}
          name={TOPIC_FORM_FIELDS.course.key}
        /> */}

        <AdminFormSelector
          loadingItems={loadingUnits}
          disabled={isLoading || loadingUnits}
          options={units}
          label={TOPIC_FORM_FIELDS.unit.label}
          name={TOPIC_FORM_FIELDS.unit.key}
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
