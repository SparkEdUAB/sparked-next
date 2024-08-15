'use client';

import { useDocumentTitle } from '@hooks/useDocumentTitle/useDocumentTitle';
import { RolesListView } from '../../../../components/roles/RolesListView';

export default function Roles() {
  useDocumentTitle('Roles');

  return <RolesListView />;
}
