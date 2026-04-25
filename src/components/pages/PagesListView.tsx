'use client';

import React, { useState } from 'react';
import { DataTable } from '@components/admin/data-table/DataTable';
import { FormSheet } from '@components/admin/form/FormSheet';
import { useAdminListViewData } from '@hooks/useAdmin/useAdminListViewData';
import { API_LINKS } from 'app/links';
import { transformRawPageLink, usePageLinks } from '@hooks/usePageLinks';
import { T_PageLinkFields, T_RawPageLinkFields } from '@hooks/usePageLinks/types';
import { pagesTableColumns } from '.';
import CreatePageView from './create-page-view';
import EditPageView from './edit-page-view';
import i18next from 'i18next';

export function PagesListView() {
  const { selectedPageLinkIds, setSelectedPageLinkIds, deletePageLinks } = usePageLinks();
  const [creatingPage, setCreatingPage] = useState(false);
  const [edittingPage, setEdittingPage] = useState<T_PageLinkFields | null>(null);

  const {
    items: pages,
    isLoading,
    mutate,
    loadMore,
    hasMore,
    error,
  } = useAdminListViewData<T_PageLinkFields, T_RawPageLinkFields>(
    API_LINKS.FETCH_PAGE_LINKS,
    'pageLinks',
    transformRawPageLink,
  );

  const rowSelection = {
    selectedRowKeys: selectedPageLinkIds,
    onChange: (selectedRowKeys: React.Key[]) => {
      setSelectedPageLinkIds(selectedRowKeys);
    },
  };

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">{i18next.t('pages')}</h1>
      </div>

      <DataTable<T_PageLinkFields>
        deleteItems={async () => {
          const r = await deletePageLinks();
          mutate();
          return r;
        }}
        rowSelection={rowSelection}
        items={pages}
        isLoading={isLoading}
        createNew={() => setCreatingPage(true)}
        editItem={(item) => setEdittingPage(item)}
        columns={pagesTableColumns}
        loadMore={loadMore}
        hasMore={hasMore}
        error={error}
      />

      <FormSheet
        open={creatingPage}
        onClose={() => setCreatingPage(false)}
        title={`Create ${i18next.t('pages')}`}
      >
        <CreatePageView
          onSuccessfullyDone={() => {
            mutate();
            setCreatingPage(false);
          }}
        />
      </FormSheet>

      <FormSheet
        open={!!edittingPage}
        onClose={() => setEdittingPage(null)}
        title={`Edit ${i18next.t('pages')}`}
      >
        {edittingPage && (
          <EditPageView
            page={edittingPage}
            onSuccessfullyDone={() => {
              mutate();
              setEdittingPage(null);
            }}
          />
        )}
      </FormSheet>
    </>
  );
}
