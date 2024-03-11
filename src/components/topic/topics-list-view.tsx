'use client';

import { AdminPageTitle } from '@components/layouts';
import { ADMIN_LINKS } from '@components/layouts/adminLayout/links';
import useNavigation from '@hooks/useNavigation';
import useTopic from '@hooks/use-topic';
import { Table } from 'antd';
import { Button, TextInput } from 'flowbite-react';
import i18next from 'i18next';
import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import { HiMagnifyingGlass, HiOutlineNewspaper, HiOutlinePencilSquare, HiTrash } from 'react-icons/hi2';
import { topicTableColumns } from '.';
import { AdminTable } from '@components/admin/AdminTable/AdminTable';
import { T_topicFields } from '@hooks/use-topic/types';

const TopicsListView: React.FC = observer(() => {
  const {
    fetchTopics,
    topics,
    selectedTopicIds: selectedTopicIds,
    setSelectedTopicIds,
    triggerDelete,
    triggerEdit,
    findTopicsByName,
    onSearchQueryChange,
    isLoading,
    deleteTopics,
  } = useTopic();
  const { router, getChildLinkByKey } = useNavigation();

  useEffect(() => {
    fetchTopics({});
  }, []);

  const rowSelection = {
    selectedRowKeys: selectedTopicIds,
    onChange: (selectedRowKeys: React.Key[]) => {
      setSelectedTopicIds(selectedRowKeys);
    },
  };

  return (
    <>
      <AdminPageTitle title={i18next.t('topics')} />

      <TextInput
        onChange={(e) => onSearchQueryChange(e.target.value)}
        icon={HiMagnifyingGlass}
        className="table-search-box"
        placeholder={i18next.t('search_units')}
        required
        type="text"
        onKeyDown={(e) => {
          e.keyCode === 13 ? findTopicsByName({ withMetaData: true }) : null;
        }}
      />
      <AdminTable<T_topicFields>
        deleteItems={deleteTopics}
        rowSelection={rowSelection}
        items={topics || []}
        isLoading={isLoading}
        createNewUrl={getChildLinkByKey('create', ADMIN_LINKS.topics)}
        getEditUrl={(id) => getChildLinkByKey('edit', ADMIN_LINKS.topics) + `?topicId=${id}`}
        columns={topicTableColumns}
      />
    </>
  );
});

export default TopicsListView;
