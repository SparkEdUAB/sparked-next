'use client';

import { AdminFormInput } from '@components/admin/AdminForm/AdminFormInput';
import { AdminPageTitle } from '@components/layouts';
import useUser from '@hooks/useUser';
import { T_CreateUserFields } from '@hooks/useUser/types';
import { Button, Spinner } from 'flowbite-react';
import i18next from 'i18next';
import { FormEventHandler, useState } from 'react';
import { extractValuesFromFormEvent } from 'utils/helpers/extractValuesFromFormEvent';
import { USER_FORM_FIELDS } from './constants';
import Autocomplete from '@components/atom/Autocomplete/Autocomplete';
import { API_LINKS } from 'app/links';
import { T_RoleFields } from '@hooks/useRoles/types';
import { useToastMessage } from 'providers/ToastMessageContext';

const CreateUserView = ({ onSuccessfullyDone }: { onSuccessfullyDone: () => void }) => {
  const { createUser, isLoading } = useUser();
  const [role, setRole] = useState<T_RoleFields | null>(null);
  const message = useToastMessage();

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    if (!role) {
      message.error(`You need to provide a role to create a user.`);
      return;
    }

    const keys = [USER_FORM_FIELDS.first_name.key, USER_FORM_FIELDS.last_name.key];
    let result = extractValuesFromFormEvent<T_CreateUserFields>(e, keys);

    createUser(
      {
        ...result,
        role: role.name,
      },
      onSuccessfullyDone,
    );
  };

  return (
    <>
      <AdminPageTitle title={i18next.t('create_user')} />

      <form className="flex flex-col gap-4 max-w-xl" onSubmit={handleSubmit}>
        <AdminFormInput
          disabled={isLoading}
          name={USER_FORM_FIELDS.first_name.key}
          label={USER_FORM_FIELDS.first_name.label}
          required
        />

        <AdminFormInput
          disabled={isLoading}
          name={USER_FORM_FIELDS.last_name.key}
          label={USER_FORM_FIELDS.last_name.label}
          required
        />

        {/* <Autocomplete<T_RoleFields>
          url={API_LINKS.FIND_ROLES_BY_NAME}
          handleSelect={setRole}
          moduleName="roles"
          disabled={isLoading}
        /> */}

        <Button type="submit" className="mt-2" disabled={isLoading}>
          {isLoading ? <Spinner size="sm" className="mr-3" /> : undefined}
          {i18next.t('submit')}
        </Button>
      </form>
    </>
  );
};

export default CreateUserView;
