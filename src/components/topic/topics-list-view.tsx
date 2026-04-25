'use client';

import React, { useState } from 'react';
import { DataTable } from '@components/admin/data-table/DataTable';
import { FormSheet } from '@components/admin/form/FormSheet';
import { useAdminListViewData } from '@hooks/useAdmin/useAdminListViewData';
import { API_LINKS } from 'app/links';
import useTopic, { transformRawTopic } from '@hooks/use-topic';
import { T_TopicFields } from '@hooks/use-topic/types';
import { topicTableColumns } from '.';
import CreateTopicView from './create-topic-view';
import EditTopicView from './edit-topic-view';
import i18next from 'i18next';

const TopicsListView: React.FC = () => {
  const { selectedTopicIds, setSelectedTopicIds, onSearchQueryChange, deleteTopics, searchQuery } =
    useTopic();
  const [creatingTopic, setCreatingTopic] = useState(false);
  const [edittingTopic, setEdittingTopic] = useState<T_TopicFields | null>(null);

  const { items: topics, isLoading, mutate, loadMore, hasMore, error } = useAdminListViewData(
    API_LINKS.FETCH_TOPICS,
    'topics',
    transformRawTopic,
    API_LINKS.FIND_TOPIC_BY_NAME,
    searchQuery,
  );

  const rowSelection = {
    selectedRowKeys: selectedTopicIds,
    onChange: (selectedRowKeys: React.Key[]) => setSelectedTopicIds(selectedRowKeys),
  };

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">{i18next.t('topics')}</h1>
      </div>

      <DataTable<T_TopicFields>
        deleteItems={async () => { const r = await deleteTopics(); mutate(); return r; }}
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

      <FormSheet
        open={creatingTopic}
        onClose={() => setCreatingTopic(false)}
        title={`Create ${i18next.t('topics')}`}
      >
        <CreateTopicView
          onSuccessfullyDone={() => { mutate(); setCreatingTopic(false); }}
        />
      </FormSheet>

      <FormSheet
        open={!!edittingTopic}
        onClose={() => setEdittingTopic(null)}
        title={`Edit ${i18next.t('topics')}`}
      >
        {edittingTopic && (
          <EditTopicView
            topic={edittingTopic}
            onSuccessfullyDone={() => { mutate(); setEdittingTopic(null); }}
          />
        )}
      </FormSheet>
    </>
  );
};

export default TopicsListView;
