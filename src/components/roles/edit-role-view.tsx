'use client';

import { AdminPageTitle } from '@components/layouts';
import { Spinner } from 'flowbite-react';
import i18next from 'i18next';
import { FormEventHandler, useState } from 'react';
import { ROLE_FORM_FIELDS } from './constants';
import { extractValuesFromFormEvent } from 'utils/helpers/extractValuesFromFormEvent';
import { AdminFormInput } from '@components/admin/AdminForm/AdminFormInput';
import { LibraryErrorMessage } from '@components/library/LibraryErrorMessage/LibraryErrorMessage';
import { DeletionWarningModal } from '@components/admin/AdminTable/DeletionWarningModal';
import { UpdateButtons } from '@components/atom/UpdateButtons/UpdateButtons';
import { useRoles } from '@hooks/useRoles';
import { T_CreateRoleFields, T_RoleFields } from '@hooks/useRoles/types';

const EditRoleView = ({ role, onSuccessfullyDone }: { role: T_RoleFields; onSuccessfullyDone: () => void }) => {
  const { editRole, deleteRoles } = useRoles();
  const [uploading, setUploading] = useState(false);
  const [showDeletionWarning, setShowDeletionWarning] = useState(false);
  const toggleDeletionWarning = () => setShowDeletionWarning((value) => !value);

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    try {
      setUploading(true);
      e.preventDefault();

      const keys = [ROLE_FORM_FIELDS.name.key, ROLE_FORM_FIELDS.description.key];

      let result = extractValuesFromFormEvent<T_CreateRoleFields>(e, keys);

      await editRole({ ...role, ...result }, onSuccessfullyDone);
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <AdminPageTitle title={i18next.t('edit_role')} />

      {role === null ? (
        <div className="flex items-center justify-center h-[400px]">
          <Spinner size="xl" />
        </div>
      ) : role instanceof Error ? (
        <LibraryErrorMessage>{role.message}</LibraryErrorMessage>
      ) : (
        <form className="flex flex-col gap-4 max-w-xl" onSubmit={handleSubmit}>
          <AdminFormInput
            disabled={uploading}
            name={ROLE_FORM_FIELDS.name.key}
            label={ROLE_FORM_FIELDS.name.label}
            defaultValue={role.name}
            required
          />

          <AdminFormInput
            disabled={uploading}
            name={ROLE_FORM_FIELDS.description.key}
            label={ROLE_FORM_FIELDS.description.label}
            defaultValue={role.description}
            required
          />

          <UpdateButtons uploading={uploading} toggleDeletionWarning={toggleDeletionWarning} />
        </form>
      )}

      <DeletionWarningModal
        showDeletionWarning={showDeletionWarning}
        toggleDeletionWarning={toggleDeletionWarning}
        deleteItems={async () => {
          try {
            setUploading(true);
            const successful = await deleteRoles([role._id]);
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

export default EditRoleView;
