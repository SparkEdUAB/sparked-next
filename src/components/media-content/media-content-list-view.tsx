'use client';

import { AdminPageTitle } from '@components/layouts';
import useMediaContent, { transformRawMediaContent } from '@hooks/use-media-content';
import { Drawer, Modal } from 'flowbite-react';
import i18next from 'i18next';
import React, { useState } from 'react';
import { mediaContentTableColumns } from '.';
import { T_MediaContentFields } from 'types/media-content';
import { AdminTable } from '@components/admin/AdminTable/AdminTable';
import CreateMediaContentView from './create-media-content-view';
import EditMediaContentView from './edit-media-content-view';
import { API_LINKS } from 'app/links';
import { useAdminListViewData } from '@hooks/useAdmin/useAdminListViewData';

const MediaContentListView: React.FC = () => {
  const { selectedMediaContentIds, setSelectedMediaContentIds, onSearchQueryChange, deleteMediaContent, searchQuery } =
    useMediaContent();
  const [creatingResource, setCreatingResource] = useState(false);
  const [edittingResource, setEdittingResource] = useState<T_MediaContentFields | null>(null);

  const {
    items: mediaContent,
    isLoading,
    mutate,
  } = useAdminListViewData(
    API_LINKS.FETCH_MEDIA_CONTENT,
    'mediaContent',
    transformRawMediaContent,
    API_LINKS.FIND_MEDIA_CONTENT_BY_NAME,
    searchQuery,
  );

  const rowSelection = {
    selectedRowKeys: selectedMediaContentIds,
    onChange: (selectedRowKeys: React.Key[]) => {
      setSelectedMediaContentIds(selectedRowKeys);
    },
  };

  return (
    <>
      <AdminPageTitle title={i18next.t('media_content')} />

      <AdminTable<T_MediaContentFields>
        deleteItems={deleteMediaContent}
        rowSelection={rowSelection}
        items={mediaContent}
        isLoading={isLoading}
        createNew={() => setCreatingResource(true)}
        editItem={(item) => setEdittingResource(item)}
        columns={mediaContentTableColumns}
        onSearchQueryChange={onSearchQueryChange}
      />
      <Modal dismissible show={creatingResource} onClose={() => setCreatingResource(false)} popup>
        <Modal.Header />
        <Modal.Body className="custom-scrollbar">
          <CreateMediaContentView
            onSuccessfullyDone={() => {
              mutate();
              setCreatingResource(false);
            }}
          />
        </Modal.Body>
      </Modal>
      <Drawer
        className="w-[360px] sm:w-[460px] lg:w-[560px]"
        open={!!edittingResource}
        onClose={() => setEdittingResource(null)}
        position="right"
      >
        <Drawer.Header titleIcon={() => <></>} />
        <Drawer.Items className="custom-scrollbar">
          {edittingResource ? (
            <EditMediaContentView
              mediaContent={edittingResource}
              onSuccessfullyDone={() => {
                mutate();
                setEdittingResource(null);
              }}
            />
          ) : null}
        </Drawer.Items>
      </Drawer>
    </>
  );
};

export default MediaContentListView;
