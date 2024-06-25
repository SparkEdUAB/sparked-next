'use client';

import { useDocumentTitle } from '@hooks/useDocumentTitle/useDocumentTitle';
import { RolesListView } from './RolesListView';

export default function Roles() {
  useDocumentTitle('Roles');

  return <RolesListView />;
}
