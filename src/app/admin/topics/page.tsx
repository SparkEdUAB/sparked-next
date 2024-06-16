'use client';

import TopicsListView from '@components/topic/topics-list-view';
import { useDocumentTitle } from '@hooks/useDocumentTitle/useDocumentTitle';
import React from 'react';

const TopicsList: React.FC = (props) => {
  useDocumentTitle('Topics');

  return <TopicsListView />;
};

export default TopicsList;
