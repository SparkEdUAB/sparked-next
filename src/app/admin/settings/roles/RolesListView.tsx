'use client';

import { useAdminListViewData } from '@hooks/useAdmin/useAdminListViewData';
import { useRoles } from '@hooks/useRoles';
import { API_LINKS } from 'app/links';
import { useState } from 'react';

export function RolesListView() {
  const { selectedRoleIds, setSelectedRoleIds } = useRoles();
  const [creatingRole, setCreatingRole] = useState(false);
  const [edittingRole, setEdittingRole] = useState<any | null>(null);

  const {
    items: roles,
    isLoading,
    mutate,
    loadMore,
    hasMore,
    error,
  } = useAdminListViewData(API_LINKS.FETCH_USER_ROLES, 'userRoles', (e) => {
    console.log(e);
    return e;
  });

  console.log(roles);

  const rowSelection = {
    selectedRowKeys: selectedRoleIds,
    onChange: (selectedRowKeys: React.Key[]) => {
      setSelectedRoleIds(selectedRowKeys);
    },
  };

  return <div></div>;
}
