'use client';

import { AdminPageTitle } from '@components/layouts';
import { ADMIN_LINKS } from '@components/layouts/adminLayout/links';
import useMediaContent from '@hooks/use-media-content';
import useNavigation from '@hooks/useNavigation';
import { Table } from 'antd';
import { Button, Modal, TextInput } from 'flowbite-react';
import i18next from 'i18next';
import { observer } from 'mobx-react-lite';
import React, { useEffect, useMemo, useState } from 'react';
import { HiMagnifyingGlass, HiOutlineNewspaper, HiOutlinePencilSquare, HiTrash } from 'react-icons/hi2';
import { mediaContentTableColumns } from '.';
import { T_MediaContentFields } from 'types/media-content';
import { AdminTable } from '@components/admin/AdminTable/AdminTable';
import { T_ItemTypeBase } from '@components/admin/AdminTable/types';
import CreateMediaContentView from './create-media-content-view';
import EditMediaContentView from './edit-media-content-view';
import { useFetch } from '@hooks/use-swr';
import { API_LINKS } from 'app/links';

const MediaContentListView: React.FC = observer(() => {
  const {
    selectedMediaContentIds,
    setSelectedMediaContentIds,
    triggerDelete,
    triggerEdit,
    findMediaContentByName,
    onSearchQueryChange,
    isLoading,
    deleteMediaContent,
    mediaContent,
    fetchMediaContent,
  } = useMediaContent();
  const { router, getChildLinkByKey } = useNavigation();
  const [creatingResource, setCreatingResource] = useState(false);
  const [edittingResourceWithId, setEdittingResourceWithId] = useState<string | null>(null);

  const { data, isLoading: loading, mutate } = useFetch(API_LINKS.FETCH_MEDIA_CONTENT);

  useEffect(() => {
    fetchMediaContent({});
  }, []);

  // const mediaContent = useMemo(() => {
  //   return (
  //     // @ts-expect-error we can also add this mediaContent as the return type of the useFetch hook
  //     (data?.mediaContent as any[])?.map<T_MediaContentFields>(
  //       (i, index: number) =>
  //         ({
  //           index: index + 1,
  //           key: i._id,
  //           _id: i._id,
  //           name: i.name,
  //           fileUrl: i.file_url || undefined,
  //           thumbnailUrl: i.thumbnailUrl,
  //           description: i.description,
  //           unitId: i.course?._id,
  //           unitName: i.unit?.name,
  //           topicId: i.topic?._id,
  //           topicName: i.topic?.name,
  //           created_by: i.user?.email,
  //           created_at: new Date(i.created_at as string).toDateString(),
  //         } satisfies T_MediaContentFields),
  //     ) || []
  //   );
  // }, [data]);

  const rowSelection = {
    selectedRowKeys: selectedMediaContentIds,
    onChange: (selectedRowKeys: React.Key[]) => {
      setSelectedMediaContentIds(selectedRowKeys);
    },
  };

  return (
    <>
      <AdminPageTitle title={i18next.t('media_content')} />

      <TextInput
        onChange={(e) => onSearchQueryChange(e.target.value)}
        icon={HiMagnifyingGlass}
        className="table-search-box"
        placeholder={i18next.t('search_media_content')}
        required
        type="text"
        onKeyDown={(e) => {
          e.keyCode === 13 ? findMediaContentByName({ withMetaData: true }) : null;
        }}
      />
      <AdminTable<T_MediaContentFields>
        deleteItems={deleteMediaContent}
        rowSelection={rowSelection}
        items={mediaContent}
        isLoading={isLoading}
        // createNewUrl={getChildLinkByKey('create', ADMIN_LINKS.media_content)}
        // getEditUrl={(id) => getChildLinkByKey('edit', ADMIN_LINKS.media_content) + `?mediaContentId=${id}`}
        createNew={() => setCreatingResource(true)}
        editItem={(id) => setEdittingResourceWithId(id)}
        columns={mediaContentTableColumns}
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
