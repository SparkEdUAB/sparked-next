/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { AdminPageTitle } from '@components/layouts';
import { Button, Spinner } from 'flowbite-react';
import i18next from 'i18next';
import { FormEventHandler, useState } from 'react';
import { SUBJECT_FORM_FIELDS } from './constants';
import useSubject from '@hooks/useSubject';
import { AdminFormInput } from '@components/admin/AdminForm/AdminFormInput';
import { extractValuesFromFormEvent } from 'utils/helpers';
import { T_SubjectFields } from '@hooks/useSubject/types';
import { LibraryErrorMessage } from '@components/library/LibraryErrorMessage/LibraryErrorMessage';
import { DeletionWarningModal } from '@components/admin/AdminTable/DeletionWarningModal';
import Autocomplete from '@components/atom/Autocomplete/Autocomplete';
import { API_LINKS } from 'app/links';
import { T_GradeFields } from '@hooks/useGrade/types';
import { UpdateButtons } from '@components/atom/UpdateButtons/UpdateButtons';
import { transformRawUnit } from '@hooks/useUnit';
import { useAdminItemById } from '@hooks/useAdmin/useAdminItemById';

const EditSubjectView = ({
  subject,
  onSuccessfullyDone,
}: {
  subject: T_SubjectFields;
  onSuccessfullyDone: () => void;
}) => {
  const { editSubject, deleteSubject } = useSubject();
  const [uploading, setUploading] = useState(false);
  const [gradeId, setGradeId] = useState<string | null>(null);
  const [showDeletionWarning, setShowDeletionWarning] = useState(false);
  const toggleDeletionWarning = () => setShowDeletionWarning((value) => !value);

  const handleClick = (grade: T_GradeFields) => {
    setGradeId(grade?._id);
  };
  const { item: grade, isLoading: loadingUnits } = useAdminItemById(
    API_LINKS.FETCH_GRADE_BY_ID,
    subject.gradeId,
    'grade',
    transformRawUnit,
  );

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    try {
      setUploading(true);
      e.preventDefault();

      const keys = [SUBJECT_FORM_FIELDS.name.key, SUBJECT_FORM_FIELDS.description.key];

      let result = extractValuesFromFormEvent<T_SubjectFields>(e, keys);

      await editSubject({ ...subject, ...result, gradeId: gradeId as string }, onSuccessfullyDone);
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <AdminPageTitle title={i18next.t('edit_subject')} />

      {subject === null ? (
        <div className="flex items-center justify-center h-[400px]">
          <Spinner size="xl" />
        </div>
      ) : subject instanceof Error ? (
        <LibraryErrorMessage>{subject.message}</LibraryErrorMessage>
      ) : (
        <form className="flex flex-col items-start" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-4 max-w-xl w-full">
            <AdminFormInput
              disabled={uploading}
              name={SUBJECT_FORM_FIELDS.name.key}
              label={SUBJECT_FORM_FIELDS.name.label}
              required
              defaultValue={subject.name}
            />

            <AdminFormInput
              disabled={uploading}
              name={SUBJECT_FORM_FIELDS.description.key}
              label={SUBJECT_FORM_FIELDS.description.label}
              required
              defaultValue={subject.description}
            />

            <Autocomplete url={API_LINKS.FIND_GRADE_BY_NAME} handleSelect={handleClick} moduleName="grades" />
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
            const successful = await deleteSubject([subject]);
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

export default EditSubjectView;
