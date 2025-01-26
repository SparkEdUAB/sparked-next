'use client';

import { AdminFormInput } from '@components/admin/AdminForm/AdminFormInput';
import { DeletionWarningModal } from '@components/admin/AdminTable/DeletionWarningModal';
import { UpdateButtons } from '@components/atom/UpdateButtons/UpdateButtons';
import { AdminPageTitle } from '@components/layouts';
import { LibraryErrorMessage } from '@components/library/LibraryErrorMessage/LibraryErrorMessage';
import { T_RoleFields } from '@hooks/useRoles/types';
import useUser from '@hooks/useUser';
import { T_UserFields } from '@hooks/useUser/types';
import { Spinner } from 'flowbite-react';
import i18next from 'i18next';
import { FormEventHandler, useState } from 'react';
import { extractValuesFromFormEvent } from 'utils/helpers/extractValuesFromFormEvent';
import { USER_FORM_FIELDS } from './constants';

const EditUserView = ({ user, onSuccessfullyDone }: { user: T_UserFields; onSuccessfullyDone: () => void }) => {
  const { editUser, deleteUsers } = useUser();
  const [uploading, setUploading] = useState(false);
  const [showDeletionWarning, setShowDeletionWarning] = useState(false);
  const [role, setRole] = useState<T_RoleFields | null>(null);
  const toggleDeletionWarning = () => setShowDeletionWarning((value) => !value);

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    try {
      setUploading(true);
      e.preventDefault();

      const keys = [USER_FORM_FIELDS.first_name.key, USER_FORM_FIELDS.last_name.key];
      let result = extractValuesFromFormEvent<Omit<T_UserFields, '_id' | 'role'>>(e, keys);

      await editUser(
        {
          ...user,
          ...result,
          role: role?.name || user.role,
        },
        onSuccessfullyDone,
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <AdminPageTitle title={i18next.t('edit_user')} />

      {user === null ? (
        <div className="flex items-center justify-center h-[400px]">
          <Spinner size="xl" />
        </div>
      ) : user instanceof Error ? (
        <LibraryErrorMessage>{user.message}</LibraryErrorMessage>
      ) : (
        <form className="flex flex-col gap-4 max-w-xl" onSubmit={handleSubmit}>
          <AdminFormInput
            disabled={uploading}
            name={USER_FORM_FIELDS.first_name.key}
            label={USER_FORM_FIELDS.first_name.label}
            defaultValue={user.firstName}
            required
          />

          <AdminFormInput
            disabled={uploading}
            name={USER_FORM_FIELDS.last_name.key}
            label={USER_FORM_FIELDS.last_name.label}
            defaultValue={user.lastName}
            required
          />

          {/* <Autocomplete<T_RoleFields>
            url={API_LINKS.FIND_ROLES_BY_NAME}
            handleSelect={setRole}
            defaultValue={user.role}
            moduleName="roles"
            disabled={uploading}
          /> */}

          <UpdateButtons uploading={uploading} toggleDeletionWarning={toggleDeletionWarning} />
        </form>
      )}

      <DeletionWarningModal
        showDeletionWarning={showDeletionWarning}
        toggleDeletionWarning={toggleDeletionWarning}
        deleteItems={async () => {
          try {
            setUploading(true);
            //   @ts-expect-error
            const successful = await deleteUsers([user._id]);
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

export default EditUserView;
