'use client';

import { AdminPageTitle } from '@components/layouts';
// import { transformRawCourse } from '@hooks/useCourse';
import { Button, Spinner } from 'flowbite-react';
import i18next from 'i18next';
import { FormEventHandler, useState } from 'react';
import { UNIT_FORM_FIELDS } from './constants';
import useUnit from '@hooks/useUnit';
import { extractValuesFromFormEvent } from 'utils/helpers/extractValuesFromFormEvent';
import { T_CreateUnitFields } from '@hooks/useUnit/types';
import { AdminFormInput } from '../admin/AdminForm/AdminFormInput';
// import { useAdminListViewData } from '@hooks/useAdmin/useAdminListViewData';
import { API_LINKS } from 'app/links';
import Autocomplete from '@components/atom/Autocomplete/Autocomplete';
import { T_SubjectWithoutMetadata } from '@hooks/useSubject/types';

const CreateUnitView = ({ onSuccessfullyDone }: { onSuccessfullyDone?: () => void }) => {
  const { createUnit, isLoading } = useUnit();
  const [subject, setSubject] = useState<T_SubjectWithoutMetadata | null>(null);

  // const { items: courses } = useAdminListViewData(API_LINKS.FETCH_COURSES, 'courses', transformRawCourse);

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    const keys = [UNIT_FORM_FIELDS.name.key, UNIT_FORM_FIELDS.description.key];

    let result = extractValuesFromFormEvent<Omit<T_CreateUnitFields, 'schoolId' | 'programId'>>(e, keys);
    // let course = courses.find((course) => course._id === result.courseId);
    createUnit(
      { ...result, subjectId: subject?._id as string, gradeId: subject?.grade_id as string },
      onSuccessfullyDone,
    );
  };

  // const handleClick = (subject: T_SubjectFields) => {
  //   setSubjectId(subject?._id);
  // };

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

        <Autocomplete<T_SubjectWithoutMetadata>
          url={API_LINKS.FIND_SUBJECT_BY_NAME}
          handleSelect={setSubject}
          moduleName="subjects"
          disabled={isLoading}
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
