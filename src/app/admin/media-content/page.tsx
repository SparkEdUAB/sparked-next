'use client';

import MediaContentListView from '@components/media-content/media-content-list-view';
import { useDocumentTitle } from '@hooks/useDocumentTitle/useDocumentTitle';
import React from 'react';

export const dynamic = 'force-dynamic';

const MediaContentList: React.FC = (props) => {
  useDocumentTitle('Media Content');

  return <MediaContentListView />;
};

export default MediaContentList;
