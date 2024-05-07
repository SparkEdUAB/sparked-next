'use client';

import { AdminPageTitle } from '@components/layouts';
import useTopic, { transformRawTopic } from '@hooks/use-topic';
import { Modal } from 'flowbite-react';
import i18next from 'i18next';
import { observer } from 'mobx-react-lite';
import React, { useState } from 'react';
import { topicTableColumns } from '.';
import { AdminTable } from '@components/admin/AdminTable/AdminTable';
import { T_TopicFields } from '@hooks/use-topic/types';
import CreateTopicView from './create-topic-view';
import EditTopicView from './edit-topic-view';
import { useAdminListViewData } from '@hooks/useAdmin/useAdminListViewData';
import { API_LINKS } from 'app/links';

const TopicsListView: React.FC = observer(() => {
  const {
    selectedTopicIds: selectedTopicIds,
    setSelectedTopicIds,
    onSearchQueryChange,
    deleteTopics,
    searchQuery,
  } = useTopic();
  const [creatingTopic, setCreatingTopic] = useState(false);
  const [edittingTopicWithId, setEdittingTopicWithId] = useState<string | null>(null);

  const {
    items: topics,
    isLoading,
    mutate,
  } = useAdminListViewData(API_LINKS.FETCH_TOPICS, 'topics', transformRawTopic, searchQuery);

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
        editItem={(id) => setEdittingTopicWithId(id)}
        columns={topicTableColumns}
        onSearchQueryChange={onSearchQueryChange}
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
      <Modal dismissible show={!!edittingTopicWithId} onClose={() => setEdittingTopicWithId(null)} popup>
        <Modal.Header />
        <Modal.Body>
          {edittingTopicWithId ? (
            <EditTopicView
              topicId={edittingTopicWithId}
              onSuccessfullyDone={() => {
                mutate();
                setEdittingTopicWithId(null);
              }}
            />
          ) : null}
        </Modal.Body>
      </Modal>
    </>
  );
});

export default TopicsListView;
