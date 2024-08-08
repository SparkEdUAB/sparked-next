'use client';

import { AdminTable } from '@components/admin/AdminTable/AdminTable';
import { AdminPageTitle } from '@components/layouts';
import { useAdminListViewData } from '@hooks/useAdmin/useAdminListViewData';
import { transformRawPageLink, usePageLinks } from '@hooks/usePageLinks';
import { T_PageLinkFields, T_RawPageLinkFields } from '@hooks/usePageLinks/types';
import { API_LINKS } from 'app/links';
import { Button, Drawer, Modal } from 'flowbite-react';
import i18next from 'i18next';
import { useState } from 'react';
import { FaRegHandPointer } from 'react-icons/fa';
import { RiFileList2Line } from 'react-icons/ri';
import { pagesTableColumns } from '.';
import CreatePageView from './create-page-view';
import EditPageView from './edit-page-view';

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
      <AdminPageTitle title={i18next.t('pages')} />

      <AdminTable<T_PageLinkFields>
        deleteItems={deletePageLinks}
        rowSelection={rowSelection}
        items={pages}
        isLoading={isLoading}
        createNew={() => setCreatingPage(true)}
        editItem={setEdittingPage}
        columns={pagesTableColumns}
        loadMore={loadMore}
        hasMore={hasMore}
        error={error}
        additionalButtons={
          <>
            <Button className="rounded-none">
              <FaRegHandPointer className="mr-3 h-4 w-4" />
              Assign Actions
            </Button>
            <Button className="rounded-none">
              <RiFileList2Line className="mr-3 h-4 w-4" />
              New Actions
            </Button>
            <Button className="rounded-none">
              <RiFileList2Line className="mr-3 h-4 w-4" />
              Page Actions
            </Button>
          </>
        }
      />
      <Modal dismissible show={creatingPage} onClose={() => setCreatingPage(false)} popup>
        <Modal.Header />
        <Modal.Body>
          <CreatePageView
            onSuccessfullyDone={() => {
              mutate();
              setCreatingPage(false);
            }}
          />
        </Modal.Body>
      </Modal>
      <Drawer
        className="w-[360px] sm:w-[460px] lg:w-[560px]"
        open={!!edittingPage}
        onClose={() => setEdittingPage(null)}
        position="right"
      >
        <Drawer.Header titleIcon={() => <></>} />
        <Drawer.Items>
          {edittingPage ? (
            <EditPageView
              page={edittingPage}
              onSuccessfullyDone={() => {
                mutate();
                setEdittingPage(null);
              }}
            />
          ) : null}
        </Drawer.Items>
      </Drawer>
    </>
  );
}
