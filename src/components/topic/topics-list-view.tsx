'use client';

import { AdminPageTitle } from '@components/layouts';
import useNavigation from '@hooks/useNavigation';
import useTopic from '@hooks/use-topic';
import { Modal, TextInput } from 'flowbite-react';
import i18next from 'i18next';
import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import { HiMagnifyingGlass } from 'react-icons/hi2';
import { topicTableColumns } from '.';
import { AdminTable } from '@components/admin/AdminTable/AdminTable';
import { T_TopicFields } from '@hooks/use-topic/types';
import CreateTopicView from './create-topic-view';
import EditTopicView from './edit-topic-view';

const TopicsListView: React.FC = observer(() => {
  const {
    fetchTopics,
    topics,
    selectedTopicIds: selectedTopicIds,
    setSelectedTopicIds,
    findTopicsByName,
    onSearchQueryChange,
    isLoading,
    deleteTopics,
  } = useTopic();
  const { router, getChildLinkByKey } = useNavigation();
  const [creatingTopic, setCreatingTopic] = useState(false);
  const [edittingTopicWithId, setEdittingTopicWithId] = useState<string | null>(null);

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
      <AdminTable<T_TopicFields>
        deleteItems={deleteTopics}
        rowSelection={rowSelection}
        items={topics || []}
        isLoading={isLoading}
        // createNewUrl={getChildLinkByKey('create', ADMIN_LINKS.topics)}
        // getEditUrl={(id) => getChildLinkByKey('edit', ADMIN_LINKS.topics) + `?topicId=${id}`}
        createNew={() => setCreatingTopic(true)}
        editItem={(id) => setEdittingTopicWithId(id)}
        columns={topicTableColumns}
      />
      <Modal dismissible show={creatingTopic} onClose={() => setCreatingTopic(false)} popup>
        <Modal.Header />
        <Modal.Body>
          <CreateTopicView
            onSuccessfullyDone={() => {
              fetchTopics({});
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
                fetchTopics({});
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
