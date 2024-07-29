'use client';

import { PagesListView } from '@components/pages/PagesListView';
import { useDocumentTitle } from '@hooks/useDocumentTitle/useDocumentTitle';

export default function Pages() {
  useDocumentTitle('Pages');

  return <PagesListView />;
}
