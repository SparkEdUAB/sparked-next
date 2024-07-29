'use client';

import { AdminPageTitle } from '@components/layouts';
import { Button, Spinner } from 'flowbite-react';
import i18next from 'i18next';
import { FormEventHandler, useState } from 'react';
import { COURSE_FORM_FIELDS } from './constants';
import useCourse from '@hooks/useCourse';
import { AdminFormInput } from '@components/admin/AdminForm/AdminFormInput';
import { extractValuesFromFormEvent } from 'utils/helpers/extractValuesFromFormEvent';
import { T_CourseFields } from '@hooks/useCourse/types';
import { LibraryErrorMessage } from '@components/library/LibraryErrorMessage/LibraryErrorMessage';
import { DeletionWarningModal } from '@components/admin/AdminTable/DeletionWarningModal';
import { T_NameAndDescription } from 'types';

const EditCourseView = ({ course, onSuccessfullyDone }: { course: T_CourseFields; onSuccessfullyDone: () => void }) => {
  const { editCourse, deleteCourse } = useCourse();
  const [uploading, setUploading] = useState(false);
  const [showDeletionWarning, setShowDeletionWarning] = useState(false);
  const toggleDeletionWarning = () => setShowDeletionWarning((value) => !value);

  // const { item: course, isLoading } = useAdminItemById(
  //   API_LINKS.FETCH_COURSE_BY_ID,
  //   courseId || (searchParams.get('courseId') as string),
  //   'course',
  //   transformRawCourse,
  // );

  // const { items: schools, isLoading: loadingSchools } = useAdminListViewData(
  //   API_LINKS.FETCH_SCHOOLS,
  //   'schools',
  //   transformRawSchool,
  // );

  // const { items: programs, isLoading: loadingPrograms } = useAdminListViewData(
  //   API_LINKS.FETCH_PROGRAMS,
  //   'programs',
  //   transformRawProgram,
  // );

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    try {
      setUploading(true);
      e.preventDefault();

      const keys = [
        COURSE_FORM_FIELDS.name.key,
        COURSE_FORM_FIELDS.description.key,
        // COURSE_FORM_FIELDS.school.key,
        // COURSE_FORM_FIELDS.program.key,
      ];

      let result = extractValuesFromFormEvent<T_NameAndDescription>(e, keys);

      await editCourse({ ...course, ...result }, onSuccessfullyDone);
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <AdminPageTitle title={i18next.t('edit_course')} />

      {course === null ? (
        <div className="flex items-center justify-center h-[400px]">
          <Spinner size="xl" />
        </div>
      ) : course instanceof Error ? (
        <LibraryErrorMessage>{course.message}</LibraryErrorMessage>
      ) : (
        <form className="flex flex-col items-start" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-4 max-w-xl w-full">
            <AdminFormInput
              disabled={uploading}
              name={COURSE_FORM_FIELDS.name.key}
              label={COURSE_FORM_FIELDS.name.label}
              required
              defaultValue={course.name}
            />

            <AdminFormInput
              disabled={uploading}
              name={COURSE_FORM_FIELDS.description.key}
              label={COURSE_FORM_FIELDS.description.label}
              required
              defaultValue={course.description}
            />

            {/* <AdminFormSelector
              loadingItems={loadingSchools}
              disabled={uploading || loadingSchools}
              options={schools}
              label={COURSE_FORM_FIELDS.school.label}
              name={COURSE_FORM_FIELDS.school.key}
              defaultValue={course.schoolId}
            />

            <AdminFormSelector
              loadingItems={loadingPrograms}
              disabled={uploading || loadingPrograms}
              options={programs}
              label={COURSE_FORM_FIELDS.program.label}
              name={COURSE_FORM_FIELDS.program.key}
              defaultValue={course.programId}
            /> */}

            <Button type="submit" className="mt-2" disabled={uploading}>
              {uploading ? <Spinner size="sm" className="mr-3" /> : undefined}
              {i18next.t('update')}
            </Button>

            <Button color="red" onClick={toggleDeletionWarning} disabled={uploading}>
              {uploading ? <Spinner size="sm" className="mr-3" /> : undefined}
              {i18next.t('delete')}
            </Button>
          </div>
        </form>
      )}

      <DeletionWarningModal
        showDeletionWarning={showDeletionWarning}
        toggleDeletionWarning={toggleDeletionWarning}
        deleteItems={async () => {
          try {
            setUploading(true);
            const successful = await deleteCourse([course]);
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

export default EditCourseView;
