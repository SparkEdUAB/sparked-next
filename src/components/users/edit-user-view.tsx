'use client';

import { AdminFormInput } from '@components/admin/AdminForm/AdminFormInput';
import { AdminPageTitle } from '@components/layouts';
import useUser from '@hooks/useUser';
import { T_UserFields } from '@hooks/useUser/types';
import { Button, Spinner, Select } from 'flowbite-react';
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
      'phoneNumber', // This is correctly included in the keys array
    ];
    let result = extractValuesFromFormEvent<T_UserFields>(e, keys);

    // Preserve student-related fields
    if (user.isStudent) {
      result.isStudent = user.isStudent;
      result.institutionType = user.institutionType;

      if (user.institutionType === 'general') {
        result.schoolName = (e.target as any).schoolName?.value || user.schoolName;
        result.grade = parseInt((e.target as any).grade?.value) || user.grade;
      }
    }

    // Make sure we're passing the phone number to the editUser function
    editUser({
      ...result,
      _id: user._id,
      role: role?.name || user.role,
      phoneNumber: result.phoneNumber // Explicitly include phoneNumber
    }, onSuccessfullyDone);
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

        <AdminFormInput
          disabled={isLoading}
          name="phoneNumber"
          label="Phone Number"
          defaultValue={user.phoneNumber}
        // Make sure it's not disabled and can be edited
        />

        {user.isStudent && (
          <div className="mt-4 border-t pt-4">
            {user.institutionType === 'general' && (
              <>
                <div className="mb-3">
                  <AdminFormInput
                    disabled
                    name="schoolName"
                    defaultValue={user.schoolName}
                    label='School Name'
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="grade" className="block text-sm font-medium mb-1">
                    Grade
                  </label>
                  <Select
                    id="grade"
                    name="grade"
                    defaultValue={user.grade?.toString()}
                    disabled
                  >
                    <option value="">Select Grade</option>
                    {Array.from({ length: 12 }, (_, i) => (
                      <option key={i + 1} value={i + 1}>
                        Grade {i + 1}
                      </option>
                    ))}
                  </Select>
                </div>
              </>
            )}
          </div>
        )}

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
