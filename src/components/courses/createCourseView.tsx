'use client';

import { AdminPageTitle } from '@components/layouts';
import useCourse from '@hooks/useCourse';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import i18next from 'i18next';
import { FormEventHandler } from 'react';
import { COURSE_FORM_FIELDS } from './constants';
import { FormInput } from '@components/admin/form/FormInput';
import { extractValuesFromFormEvent } from 'utils/helpers/extractValuesFromFormEvent';
import { T_CreateCourseFields } from '@hooks/useCourse/types';

const CreateCourseView = ({ onSuccessfullyDone }: { onSuccessfullyDone?: () => void }) => {
  const { createCourse, isLoading } = useCourse();

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    const keys = [COURSE_FORM_FIELDS.name.key, COURSE_FORM_FIELDS.description.key];

    let result = extractValuesFromFormEvent<Omit<T_CreateCourseFields, 'schoolId'>>(e, keys);
    createCourse({ ...result }, onSuccessfullyDone);
  };

  return (
    <>
      <AdminPageTitle title={i18next.t('create_course')} />

      <form className="flex flex-col gap-4 max-w-xl" onSubmit={handleSubmit}>
        <FormInput
          disabled={isLoading}
          name={COURSE_FORM_FIELDS.name.key}
          label={COURSE_FORM_FIELDS.name.label}
          required
        />

        <FormInput
          disabled={isLoading}
          name={COURSE_FORM_FIELDS.description.key}
          label={COURSE_FORM_FIELDS.description.label}
          required
        />

        <Button type="submit" className="mt-2" disabled={isLoading}>
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-3" /> : undefined}
          {i18next.t('submit')}
        </Button>
      </form>
    </>
  );
};

export default CreateCourseView;
