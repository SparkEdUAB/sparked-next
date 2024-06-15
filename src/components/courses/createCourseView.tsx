'use client';

import { AdminPageTitle } from '@components/layouts';
import useCourse from '@hooks/useCourse';
import { Button, Spinner } from 'flowbite-react';
import i18next from 'i18next';
import { FormEventHandler } from 'react';
import { COURSE_FORM_FIELDS } from './constants';
import { transformRawProgram } from '@hooks/useProgram';
import { AdminFormInput } from '@components/admin/AdminForm/AdminFormInput';
import { AdminFormSelector } from '@components/admin/AdminForm/AdminFormSelector';
import { extractValuesFromFormEvent } from 'utils/helpers/extractValuesFromFormEvent';
import { T_CreateCourseFields } from '@hooks/useCourse/types';
import { useAdminListViewData } from '@hooks/useAdmin/useAdminListViewData';
import { API_LINKS } from 'app/links';

const CreateCourseView = ({ onSuccessfullyDone }: { onSuccessfullyDone?: () => void }) => {
  const { createCourse, isLoading } = useCourse();

  // const { items: programs, isLoading: loadingPrograms } = useAdminListViewData(
  //   API_LINKS.FETCH_PROGRAMS,
  //   'programs',
  //   transformRawProgram,
  // );

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    const keys = [
      COURSE_FORM_FIELDS.name.key,
      COURSE_FORM_FIELDS.description.key,
      // COURSE_FORM_FIELDS.program.key
    ];

    let result = extractValuesFromFormEvent<Omit<T_CreateCourseFields, 'schoolId'>>(e, keys);
    createCourse(
      {
        ...result,
        // schoolId: programs.find((value) => value._id === result.programId)?.schoolId
      },
      onSuccessfullyDone,
    );
  };

  return (
    <>
      <AdminPageTitle title={i18next.t('create_course')} />

      <form className="flex flex-col gap-4 max-w-xl" onSubmit={handleSubmit}>
        <AdminFormInput
          disabled={isLoading}
          name={COURSE_FORM_FIELDS.name.key}
          label={COURSE_FORM_FIELDS.name.label}
          required
        />

        <AdminFormInput
          disabled={isLoading}
          name={COURSE_FORM_FIELDS.description.key}
          label={COURSE_FORM_FIELDS.description.label}
          required
        />

        {/* <AdminFormSelector
          loadingItems={loadingPrograms}
          disabled={isLoading || loadingPrograms}
          options={programs}
          label={COURSE_FORM_FIELDS.program.label}
          name={COURSE_FORM_FIELDS.program.key}
        /> */}

        <Button type="submit" className="mt-2" disabled={isLoading}>
          {isLoading ? <Spinner size="sm" className="mr-3" /> : undefined}
          {i18next.t('submit')}
        </Button>
      </form>
    </>
  );
};

export default CreateCourseView;
