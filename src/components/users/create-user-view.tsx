'use client';

import { AdminFormInput } from '@components/admin/AdminForm/AdminFormInput';
import Autocomplete from '@components/atom/Autocomplete/Autocomplete';
import { SIGNUP_FORM_FIELDS } from '@components/auth/constants';
import { AdminPageTitle } from '@components/layouts';
import { T_RoleFields } from '@hooks/useRoles/types';
import useUser from '@hooks/useUser';
import { T_CreateUserFields } from '@hooks/useUser/types';
import { API_LINKS } from 'app/links';
import { Button, Spinner } from 'flowbite-react';
import i18next from 'i18next';
import { FormEventHandler, useState } from 'react';
import { extractValuesFromFormEvent } from 'utils/helpers/extractValuesFromFormEvent';

const CreateUserView = ({ onSuccessfullyDone }: { onSuccessfullyDone?: () => void }) => {
  const { createUser, isLoading } = useUser();
  const [role, setRole] = useState<T_RoleFields | null>(null);

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    const keys = [
      SIGNUP_FORM_FIELDS.firstName.key,
      SIGNUP_FORM_FIELDS.lastName.key,
      SIGNUP_FORM_FIELDS.email.key,
      SIGNUP_FORM_FIELDS.password.key,
    ];
    let result = extractValuesFromFormEvent<T_CreateUserFields>(e, keys);
    createUser({ ...result, role: role?.name as string }, onSuccessfullyDone as () => void);
  };

  return (
    <>
      <AdminPageTitle title={i18next.t('create_user')} />

      <form className="flex flex-col gap-4 max-w-xl" onSubmit={handleSubmit}>
        <AdminFormInput
          disabled={isLoading}
          name={SIGNUP_FORM_FIELDS.firstName.key}
          label={SIGNUP_FORM_FIELDS.firstName.label}
          required
        />

        <AdminFormInput
          disabled={isLoading}
          name={SIGNUP_FORM_FIELDS.lastName.key}
          label={SIGNUP_FORM_FIELDS.lastName.label}
          required
        />
        <AdminFormInput
          disabled={isLoading}
          name={SIGNUP_FORM_FIELDS.email.key}
          label={SIGNUP_FORM_FIELDS.email.label}
          required
        />
        <AdminFormInput
          disabled={isLoading}
          name={SIGNUP_FORM_FIELDS.password.key}
          label={SIGNUP_FORM_FIELDS.password.label}
          required
        />

        <Autocomplete<T_RoleFields>
          url={API_LINKS.FETCH_AVAILABLE_ROLES}
          handleSelect={setRole}
          moduleName="userRoles"
          disabled={isLoading}
        />

        <Button type="submit" className="mt-2" disabled={isLoading}>
          {isLoading ? <Spinner size="sm" className="mr-3" /> : null}
          {i18next.t('submit')}
        </Button>
      </form>
    </>
  );
};

export default CreateUserView;
