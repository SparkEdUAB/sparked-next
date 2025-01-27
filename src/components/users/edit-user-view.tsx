'use client';

import { AdminFormInput } from '@components/admin/AdminForm/AdminFormInput';
import { AdminPageTitle } from '@components/layouts';
import useUser from '@hooks/useUser';
import { T_UserFields } from '@hooks/useUser/types';
import { Button, Spinner } from 'flowbite-react';
import i18next from 'i18next';
import { FormEventHandler, useState } from 'react';
import { extractValuesFromFormEvent } from 'utils/helpers/extractValuesFromFormEvent';
import { SIGNUP_FORM_FIELDS } from '@components/auth/constants';
import Autocomplete from '@components/atom/Autocomplete/Autocomplete';
import { T_RoleFields } from '@hooks/useRoles/types';
import { API_LINKS } from 'app/links';

const EditUserView = ({ user, onSuccessfullyDone }: { user: T_UserFields; onSuccessfullyDone: () => void }) => {
  const { editUser, isLoading } = useUser();
  const [role, setRole] = useState<T_RoleFields | null>(null);

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    const keys = [
      SIGNUP_FORM_FIELDS.firstName.key,
      SIGNUP_FORM_FIELDS.lastName.key,
      SIGNUP_FORM_FIELDS.email.key,
    ];
    let result = extractValuesFromFormEvent<T_UserFields>(e, keys);
    editUser({ ...result, _id: user._id, role: role?.name || user.role }, onSuccessfullyDone);
  };

  return (
    <>
      <AdminPageTitle title={i18next.t('edit_user')} />

      <form className="flex flex-col gap-4 max-w-xl" onSubmit={handleSubmit}>
        <AdminFormInput
          disabled={isLoading}
          name={SIGNUP_FORM_FIELDS.firstName.key}
          label={SIGNUP_FORM_FIELDS.firstName.label}
          defaultValue={user.firstName}
          required
        />

        <AdminFormInput
          disabled={isLoading}
          name={SIGNUP_FORM_FIELDS.lastName.key}
          label={SIGNUP_FORM_FIELDS.lastName.label}
          defaultValue={user.lastName}
          required
        />

        <AdminFormInput
          disabled={isLoading}
          name={SIGNUP_FORM_FIELDS.email.key}
          label={SIGNUP_FORM_FIELDS.email.label}
          defaultValue={user.email}
          required
        />

        <Autocomplete<T_RoleFields>
          url={API_LINKS.FETCH_AVAILABLE_ROLES}
          handleSelect={setRole}
          moduleName="userRoles"
          defaultValue={user.role}
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

export default EditUserView;
