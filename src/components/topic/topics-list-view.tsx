'use client';

import { AdminPageTitle } from '@components/layouts';
import useTopic, { transformRawTopic } from '@hooks/use-topic';
import { Drawer, Modal } from 'flowbite-react';
import i18next from 'i18next';
import React, { useState } from 'react';
import { topicTableColumns } from '.';
import { AdminTable } from '@components/admin/AdminTable/AdminTable';
import { T_TopicFields } from '@hooks/use-topic/types';
import CreateTopicView from './create-topic-view';
import EditTopicView from './edit-topic-view';
import { useAdminListViewData } from '@hooks/useAdmin/useAdminListViewData';
import { API_LINKS } from 'app/links';

const TopicsListView: React.FC = () => {
  const {
    selectedTopicIds: selectedTopicIds,
    setSelectedTopicIds,
    onSearchQueryChange,
    deleteTopics,
    searchQuery,
  } = useTopic();
  const [creatingTopic, setCreatingTopic] = useState(false);
  const [edittingTopic, setEdittingTopic] = useState<T_TopicFields | null>(null);

  const {
    items: topics,
    isLoading,
    mutate,
    loadMore,
    hasMore,
    error,
  } = useAdminListViewData(
    API_LINKS.FETCH_TOPICS,
    'topics',
    transformRawTopic,
    API_LINKS.FIND_TOPIC_BY_NAME,
    searchQuery,
  );

  const rowSelection = {
    selectedRowKeys: selectedTopicIds,
    onChange: (selectedRowKeys: React.Key[]) => {
      setSelectedTopicIds(selectedRowKeys);
    },
  };

  return (
    <>
      <AdminPageTitle title={i18next.t('topics')} />

      <AdminTable<T_TopicFields>
        deleteItems={deleteTopics}
        rowSelection={rowSelection}
        items={topics || []}
        isLoading={isLoading}
        createNew={() => setCreatingTopic(true)}
        editItem={(id) => setEdittingTopic(id)}
        columns={topicTableColumns}
        onSearchQueryChange={onSearchQueryChange}
        hasMore={hasMore}
        loadMore={loadMore}
        error={error}
      />
      <Modal dismissible show={creatingTopic} onClose={() => setCreatingTopic(false)} popup>
        <Modal.Header />
        <Modal.Body>
          <CreateTopicView
            onSuccessfullyDone={() => {
              mutate();
              setCreatingTopic(false);
            }}
          />
        </Modal.Body>
      </Modal>
      <Drawer
        className="w-[360px] sm:w-[460px] lg:w-[560px]"
        open={!!edittingTopic}
        onClose={() => setEdittingTopic(null)}
        position="right"
      >
        <Drawer.Header titleIcon={() => <></>} />
        <Drawer.Items>
          {edittingTopic ? (
            <EditTopicView
              topic={edittingTopic}
              onSuccessfullyDone={() => {
                mutate();
                setEdittingTopic(null);
              }}
            />
          ) : null}
        </Drawer.Items>
      </Drawer>
    </>
  );
};

export default TopicsListView;
