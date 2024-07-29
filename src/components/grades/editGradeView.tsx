'use client';

import { AdminPageTitle } from '@components/layouts';
import { Spinner } from 'flowbite-react';
import i18next from 'i18next';
import { FormEventHandler, useState } from 'react';
import { GRADE_FORM_FIELDS } from './constants';
import useGrade from '@hooks/useGrade';
import { AdminFormInput } from '@components/admin/AdminForm/AdminFormInput';
import { extractValuesFromFormEvent } from 'utils/helpers/extractValuesFromFormEvent';
import { T_GradeFields } from '@hooks/useGrade/types';
import { LibraryErrorMessage } from '@components/library/LibraryErrorMessage/LibraryErrorMessage';
import { DeletionWarningModal } from '@components/admin/AdminTable/DeletionWarningModal';
import { UpdateButtons } from '@components/atom/UpdateButtons/UpdateButtons';
import { T_NameAndDescription } from 'types';

const EditGradeView = ({ grade, onSuccessfullyDone }: { grade: T_GradeFields; onSuccessfullyDone: () => void }) => {
  const { editGrade, deleteGrade } = useGrade();
  const [uploading, setUploading] = useState(false);
  const [showDeletionWarning, setShowDeletionWarning] = useState(false);
  const toggleDeletionWarning = () => setShowDeletionWarning((value) => !value);

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    try {
      setUploading(true);
      e.preventDefault();

      const keys = [GRADE_FORM_FIELDS.name.key, GRADE_FORM_FIELDS.description.key];

      let result = extractValuesFromFormEvent<T_NameAndDescription>(e, keys);

      await editGrade({ ...grade, ...result }, onSuccessfullyDone);
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <AdminPageTitle title={i18next.t('edit_grade')} />

      {grade === null ? (
        <div className="flex items-center justify-center h-[400px]">
          <Spinner size="xl" />
        </div>
      ) : grade instanceof Error ? (
        <LibraryErrorMessage>{grade.message}</LibraryErrorMessage>
      ) : (
        <form className="flex flex-col items-start" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-4 max-w-xl w-full">
            <AdminFormInput
              disabled={uploading}
              name={GRADE_FORM_FIELDS.name.key}
              label={GRADE_FORM_FIELDS.name.label}
              required
              defaultValue={grade.name}
            />

            <AdminFormInput
              disabled={uploading}
              name={GRADE_FORM_FIELDS.description.key}
              label={GRADE_FORM_FIELDS.description.label}
              required
              defaultValue={grade.description}
            />

            <UpdateButtons uploading={uploading} toggleDeletionWarning={toggleDeletionWarning} />
          </div>
        </form>
      )}

      <DeletionWarningModal
        showDeletionWarning={showDeletionWarning}
        toggleDeletionWarning={toggleDeletionWarning}
        deleteItems={async () => {
          try {
            setUploading(true);
            const successful = await deleteGrade([grade]);
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

export default EditGradeView;
