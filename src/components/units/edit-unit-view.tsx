'use client';

import { AdminPageTitle } from '@components/layouts';

import { Spinner } from 'flowbite-react';
import i18next from 'i18next';

import { FormEventHandler, useState } from 'react';
import { UNIT_FORM_FIELDS } from './constants';

import useUnit from '@hooks/useUnit';

import { AdminFormInput } from '@components/admin/AdminForm/AdminFormInput';
import { T_UnitFields } from '@hooks/useUnit/types';
import { extractValuesFromFormEvent } from 'utils/helpers/extractValuesFromFormEvent';
import { API_LINKS } from 'app/links';

import { LibraryErrorMessage } from '@components/library/LibraryErrorMessage/LibraryErrorMessage';
import { DeletionWarningModal } from '@components/admin/AdminTable/DeletionWarningModal';
import Autocomplete from '@components/atom/Autocomplete/Autocomplete';
// import { useAdminItemById } from '@hooks/useAdmin/useAdminItemById';
import { UpdateButtons } from '@components/atom/UpdateButtons/UpdateButtons';
// import { transformRawSubject } from '@hooks/useSubject';
import { T_NameAndDescription } from 'types';
import { T_SubjectWithoutMetadata } from '@hooks/useSubject/types';

const EditUnitView = ({ unit, onSuccessfullyDone }: { unit: T_UnitFields; onSuccessfullyDone: () => void }) => {
  const { editUnit, deleteUnits } = useUnit();
  const [uploading, setUploading] = useState(false);
  const [showDeletionWarning, setShowDeletionWarning] = useState(false);
  const [subject, setSubject] = useState<T_SubjectWithoutMetadata | null>(null);
  const toggleDeletionWarning = () => setShowDeletionWarning((value) => !value);

  // const { item: subject } = useAdminItemById(
  //   API_LINKS.FETCH_SUBJECT_BY_ID,
  //   unit.subjectId as string,
  //   'subject',
  //   transformRawSubject,
  // );

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    try {
      setUploading(true);

      e.preventDefault();
      const keys = [UNIT_FORM_FIELDS.name.key, UNIT_FORM_FIELDS.description.key];
      let result = extractValuesFromFormEvent<T_NameAndDescription>(e, keys);
      await editUnit(
        { ...unit, ...result, subjectId: subject?._id || unit.subjectId, gradeId: subject?.grade_id || unit.gradeId },
        onSuccessfullyDone,
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <AdminPageTitle title={i18next.t('edit_unit')} />

      {unit === null ? (
        <div className="flex items-center justify-center h-[400px]">
          <Spinner size="xl" />
        </div>
      ) : unit instanceof Error ? (
        <LibraryErrorMessage>{unit.message}</LibraryErrorMessage>
      ) : (
        <form className="flex flex-col items-start" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-4 md:max-w-xl w-full">
            <AdminFormInput
              disabled={uploading}
              name={UNIT_FORM_FIELDS.name.key}
              label={UNIT_FORM_FIELDS.name.label}
              required
              defaultValue={unit.name}
            />

            <AdminFormInput
              disabled={uploading}
              name={UNIT_FORM_FIELDS.description.key}
              label={UNIT_FORM_FIELDS.description.label}
              required
              defaultValue={unit.description}
            />

            <Autocomplete<T_SubjectWithoutMetadata>
              url={API_LINKS.FIND_SUBJECT_BY_NAME}
              handleSelect={setSubject}
              moduleName="subjects"
              defaultValue={unit.subjectName}
              disabled={uploading}
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
            const successful = await deleteUnits([unit]);
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

export default EditUnitView;
