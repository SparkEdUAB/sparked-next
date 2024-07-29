'use client';

import { AdminPageTitle } from '@components/layouts';
import { Button, Spinner } from 'flowbite-react';
import i18next from 'i18next';
import { FormEventHandler, useState } from 'react';
import { ROLE_FORM_FIELDS } from './constants';
import { AdminFormInput } from '@components/admin/AdminForm/AdminFormInput';
import { extractValuesFromFormEvent } from 'utils/helpers/extractValuesFromFormEvent';
// import { AdminFormSelector } from '@components/admin/AdminForm/AdminFormSelector';
// import { ADMIN_LINKS } from '@components/layouts/adminLayout/links';
import { useRoles } from '@hooks/useRoles';
import { T_CreateRoleFields } from '@hooks/useRoles/types';
// import { useAdminListViewData } from '@hooks/useAdmin/useAdminListViewData';
// import { API_LINKS } from 'app/links';
// import { transformRawPageLink } from '@hooks/usePageLinks';
// import { T_PageLinkFields, T_RawPageLinkFields } from '@hooks/usePageLinks/types';

const CreateRoleView = ({ onSuccessfullyDone }: { onSuccessfullyDone?: () => void }) => {
  const { createRole } = useRoles();
  const [uploading, setUploading] = useState(false);

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    const keys = [ROLE_FORM_FIELDS.name.key, ROLE_FORM_FIELDS.description.key];
    let result = extractValuesFromFormEvent<T_CreateRoleFields>(e, keys);

    try {
      setUploading(true);
      await createRole({ ...result }, onSuccessfullyDone);
    } finally {
      setUploading(false);
    }
  };

  // const {
  //   items: pages,
  //   isLoading,
  //   mutate,
  //   loadMore,
  //   hasMore,
  //   error,
  // } = useAdminListViewData<T_PageLinkFields, T_RawPageLinkFields>(
  //   API_LINKS.FETCH_PAGE_LINKS,
  //   'pageLinks',
  //   transformRawPageLink,
  // );

  return (
    <>
      <AdminPageTitle title={i18next.t('create_role')} />

      <form className="flex flex-col gap-4 max-w-xl" onSubmit={handleSubmit}>
        <AdminFormInput
          disabled={uploading}
          name={ROLE_FORM_FIELDS.name.key}
          label={ROLE_FORM_FIELDS.name.label}
          required
        />

        <AdminFormInput
          disabled={uploading}
          name={ROLE_FORM_FIELDS.description.key}
          label={ROLE_FORM_FIELDS.description.label}
          required
        />

        <Button type="submit" className="mt-2" disabled={uploading}>
          {uploading ? <Spinner size="sm" className="mr-3" /> : undefined}
          {i18next.t('submit')}
        </Button>
      </form>
    </>
  );
};

export default CreateRoleView;
