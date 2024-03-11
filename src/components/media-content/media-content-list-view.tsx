'use client';

import { AdminPageTitle } from '@components/layouts';
import { ADMIN_LINKS } from '@components/layouts/adminLayout/links';
import useMediaContent from '@hooks/use-media-content';
import useNavigation from '@hooks/useNavigation';
import { Table } from 'antd';
import { Button, TextInput } from 'flowbite-react';
import i18next from 'i18next';
import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import { HiMagnifyingGlass, HiOutlineNewspaper, HiOutlinePencilSquare, HiTrash } from 'react-icons/hi2';
import { mediaContentTableColumns } from '.';
import { T_MediaContentFields } from 'types/media-content';
import { AdminTable } from '@components/admin/AdminTable/AdminTable';
import { ItemTypeBase } from '@components/admin/AdminTable/types';

const MediaContentListView: React.FC = observer(() => {
  const {
    fetchMediaContent,
    mediaContent,
    selectedMediaContentIds,
    setSelectedMediaContentIds,
    triggerDelete,
    triggerEdit,
    findMediaContentByName,
    onSearchQueryChange,
    isLoading,
    deleteMediaContent,
  } = useMediaContent();
  const { router, getChildLinkByKey } = useNavigation();

  useEffect(() => {
    fetchMediaContent({});
  }, []);

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
        createNewUrl={getChildLinkByKey('create', ADMIN_LINKS.media_content)}
        getEditUrl={(id) => getChildLinkByKey('edit', ADMIN_LINKS.media_content) + `?mediaContentId=${id}`}
        columns={mediaContentTableColumns}
      />
    </>
  );
});

export default MediaContentListView;
