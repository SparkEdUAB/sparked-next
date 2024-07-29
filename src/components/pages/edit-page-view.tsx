'use client';

import { AdminPageTitle } from '@components/layouts';
import { Spinner } from 'flowbite-react';
import i18next from 'i18next';
import { FormEventHandler, useMemo, useState } from 'react';
import { PAGE_FORM_FIELDS } from './constants';
import { extractValuesFromFormEvent } from 'utils/helpers/extractValuesFromFormEvent';
import { AdminFormInput } from '@components/admin/AdminForm/AdminFormInput';
import { LibraryErrorMessage } from '@components/library/LibraryErrorMessage/LibraryErrorMessage';
import { DeletionWarningModal } from '@components/admin/AdminTable/DeletionWarningModal';
import { UpdateButtons } from '@components/atom/UpdateButtons/UpdateButtons';
import { usePageLinks } from '@hooks/usePageLinks';
import { T_CreatePageLinkFields, T_PageLinkFields } from '@hooks/usePageLinks/types';
import { AdminFormSelector } from '@components/admin/AdminForm/AdminFormSelector';
import { ADMIN_LINKS } from '@components/layouts/adminLayout/links';

const EditPageView = ({ page, onSuccessfullyDone }: { page: T_PageLinkFields; onSuccessfullyDone: () => void }) => {
  const { editPageLink, deletePageLinks } = usePageLinks();
  const [uploading, setUploading] = useState(false);
  const [showDeletionWarning, setShowDeletionWarning] = useState(false);
  const toggleDeletionWarning = () => setShowDeletionWarning((value) => !value);

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    try {
      setUploading(true);
      e.preventDefault();

      const keys = [PAGE_FORM_FIELDS.name.key, PAGE_FORM_FIELDS.description.key, PAGE_FORM_FIELDS.pageLink.key];

      let result = extractValuesFromFormEvent<T_CreatePageLinkFields>(e, keys);

      await editPageLink({ ...page, ...result }, onSuccessfullyDone);
    } finally {
      setUploading(false);
    }
  };

  const pageLinkOptions = useMemo(
    () =>
      Object.entries(ADMIN_LINKS)
        .map(([, value]) => [value.link, ...(value.children?.map((item) => item.link) || [])])
        .reduce((previous, current) => [...previous, ...current], [])
        .map(
          (value) =>
            ({ _id: value, name: value } satisfies {
              _id: string;
              name: string;
            }),
        ),
    [],
  );

  return (
    <>
      <AdminPageTitle title={i18next.t('edit_page')} />

      {page === null ? (
        <div className="flex items-center justify-center h-[400px]">
          <Spinner size="xl" />
        </div>
      ) : page instanceof Error ? (
        <LibraryErrorMessage>{page.message}</LibraryErrorMessage>
      ) : (
        <form className="flex flex-col gap-4 max-w-xl" onSubmit={handleSubmit}>
          <AdminFormInput
            disabled={uploading}
            name={PAGE_FORM_FIELDS.name.key}
            label={PAGE_FORM_FIELDS.name.label}
            defaultValue={page.name}
            required
          />

          <AdminFormInput
            disabled={uploading}
            name={PAGE_FORM_FIELDS.description.key}
            label={PAGE_FORM_FIELDS.description.label}
            defaultValue={page.description}
            required
          />

          <AdminFormSelector
            name={PAGE_FORM_FIELDS.pageLink.key}
            label={PAGE_FORM_FIELDS.pageLink.label}
            disabled={uploading}
            loadingItems={false}
            options={pageLinkOptions}
            required
            defaultValue={page.link}
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
            const successful = await deletePageLinks([page._id]);
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

export default EditPageView;
