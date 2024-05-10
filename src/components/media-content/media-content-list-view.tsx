'use client';

import { AdminPageTitle } from '@components/layouts';
import useMediaContent, { transformRawMediaContent } from '@hooks/use-media-content';
import { Modal } from 'flowbite-react';
import i18next from 'i18next';
import { observer } from 'mobx-react-lite';
import React, { useState } from 'react';
import { mediaContentTableColumns } from '.';
import { T_MediaContentFields } from 'types/media-content';
import { AdminTable } from '@components/admin/AdminTable/AdminTable';
import CreateMediaContentView from './create-media-content-view';
import EditMediaContentView from './edit-media-content-view';
import { API_LINKS } from 'app/links';
import { useAdminListViewData } from '@hooks/useAdmin/useAdminListViewData';

const MediaContentListView: React.FC = observer(() => {
  const { selectedMediaContentIds, setSelectedMediaContentIds, onSearchQueryChange, deleteMediaContent, searchQuery } =
    useMediaContent();
  const [creatingResource, setCreatingResource] = useState(false);
  const [edittingResourceWithId, setEdittingResourceWithId] = useState<string | null>(null);

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
        editItem={(id) => setEdittingResourceWithId(id)}
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
      <Modal dismissible show={!!edittingResourceWithId} onClose={() => setEdittingResourceWithId(null)} popup>
        <Modal.Header />
        <Modal.Body className="custom-scrollbar">
          {edittingResourceWithId ? (
            <EditMediaContentView
              resourceId={edittingResourceWithId}
              onSuccessfullyDone={() => {
                mutate();
                setEdittingResourceWithId(null);
              }}
            />
          ) : null}
        </Modal.Body>
      </Modal>
    </>
  );
});

export default MediaContentListView;
