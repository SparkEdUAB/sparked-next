'use client';

import { AdminPageTitle } from '@components/layouts';
import { Button, Spinner } from 'flowbite-react';
import i18next from 'i18next';
import { FormEventHandler, useMemo, useState } from 'react';
import { PAGE_FORM_FIELDS } from './constants';
import { AdminFormInput } from '@components/admin/AdminForm/AdminFormInput';
import { extractValuesFromFormEvent } from 'utils/helpers/extractValuesFromFormEvent';
import { T_CreatePageLinkFields } from '@hooks/usePageLinks/types';
import { usePageLinks } from '@hooks/usePageLinks';
import { AdminFormSelector } from '@components/admin/AdminForm/AdminFormSelector';
import { ADMIN_LINKS } from '@components/layouts/adminLayout/links';

const CreatePageView = ({ onSuccessfullyDone }: { onSuccessfullyDone?: () => void }) => {
  const { createPageLink } = usePageLinks();
  const [uploading, setUploading] = useState(false);

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    const keys = [PAGE_FORM_FIELDS.name.key, PAGE_FORM_FIELDS.description.key, PAGE_FORM_FIELDS.pageLink.key];
    let result = extractValuesFromFormEvent<T_CreatePageLinkFields>(e, keys);

    try {
      setUploading(true);
      await createPageLink({ ...result }, onSuccessfullyDone);
    } finally {
      setUploading(false);
    }
  };

  const pageLinkOptions = useMemo(
    () =>
      Object.entries(ADMIN_LINKS)
        .map(([, value]) => [value.link, ...(value.children?.map((item) => item.link) || [])])
        .reduce((previous, current) => [...previous, ...current], [])
        .map((value) => ({ _id: value, name: value })),
    [],
  );

  return (
    <>
      <AdminPageTitle title={i18next.t('create_page')} />

      <form className="flex flex-col gap-4 max-w-xl" onSubmit={handleSubmit}>
        <AdminFormInput
          disabled={uploading}
          name={PAGE_FORM_FIELDS.name.key}
          label={PAGE_FORM_FIELDS.name.label}
          required
        />

        <AdminFormInput
          disabled={uploading}
          name={PAGE_FORM_FIELDS.description.key}
          label={PAGE_FORM_FIELDS.description.label}
          required
        />

        <AdminFormSelector
          name={PAGE_FORM_FIELDS.pageLink.key}
          label={PAGE_FORM_FIELDS.pageLink.label}
          disabled={uploading}
          loadingItems={false}
          options={pageLinkOptions}
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

export default CreatePageView;
