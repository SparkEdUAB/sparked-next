'use client';

import { AdminPageTitle } from '@components/layouts';
import { Spinner } from 'flowbite-react';
import i18next from 'i18next';
import { FormEventHandler, useEffect, useState } from 'react';
import { UNIT_FORM_FIELDS } from './constants';
import useUnit from '@hooks/useUnit';
import { AdminFormInput } from '@components/admin/AdminForm/AdminFormInput';
import { T_UnitFields } from '@hooks/useUnit/types';
import { extractValuesFromFormEvent } from 'utils/helpers/extractValuesFromFormEvent';
import { API_LINKS } from 'app/links';
import { LibraryErrorMessage } from '@components/library/LibraryErrorMessage/LibraryErrorMessage';
import { DeletionWarningModal } from '@components/admin/AdminTable/DeletionWarningModal';
import SelectList from '@components/atom/SelectList/SelectList';
import { UpdateButtons } from '@components/atom/UpdateButtons/UpdateButtons';
import { T_NameAndDescription } from 'types';
import { T_SubjectWithoutMetadata } from '@hooks/useSubject/types';
import { T_GradeWithoutMetadata } from '@hooks/useGrade/types';

const EditUnitView = ({ unit, onSuccessfullyDone }: { unit: T_UnitFields; onSuccessfullyDone: () => void }) => {
  const { editUnit, deleteUnits } = useUnit();
  const [uploading, setUploading] = useState(false);
  const [showDeletionWarning, setShowDeletionWarning] = useState(false);
  const [grade, setGrade] = useState<T_GradeWithoutMetadata | null>(null);
  const [subject, setSubject] = useState<T_SubjectWithoutMetadata | null>(null);
  const toggleDeletionWarning = () => setShowDeletionWarning((value) => !value);

  useEffect(() => {
    if (unit && unit.gradeId) {
      setGrade({
        _id: unit.gradeId,
        name: unit.gradeName || unit.gradeName || '',
      } as T_GradeWithoutMetadata);
    }
  }, [unit]);

  useEffect(() => {
    if (grade && unit && grade._id === unit.gradeId && unit.subjectId) {
      setSubject({
        _id: unit.subjectId,
        name: unit.subjectName || unit.subjectName || '',
        grade_id: unit.gradeId,
      } as T_SubjectWithoutMetadata);
    } else {
      setSubject(null);
    }
  }, [grade, unit]);

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    try {
      setUploading(true);

      e.preventDefault();
      const keys = [UNIT_FORM_FIELDS.name.key, UNIT_FORM_FIELDS.description.key];
      let result = extractValuesFromFormEvent<T_NameAndDescription>(e, keys);

      const updatedUnit = {
        ...unit,
        ...result,
        gradeId: grade?._id,
        subjectId: subject?._id,
      };

      await editUnit(updatedUnit, onSuccessfullyDone);
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

            <SelectList<T_GradeWithoutMetadata>
              url={API_LINKS.FETCH_GRADES}
              handleSelect={setGrade}
              moduleName="grades"
              label="Grade"
              disabled={uploading}
              selectedItem={grade}
              placeholder="Select a grade"
              required
            />

            <SelectList<T_SubjectWithoutMetadata>
              url={API_LINKS.FETCH_SUBJECTS_BY_GRADE_ID}
              handleSelect={setSubject}
              moduleName="subjects"
              label="Subject"
              disabled={uploading || !grade}
              selectedItem={subject}
              placeholder={grade ? 'Select a subject' : 'Select a grade first'}
              queryParams={{ gradeId: grade?._id || '' }}
              required
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
