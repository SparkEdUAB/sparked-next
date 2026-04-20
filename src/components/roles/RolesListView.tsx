'use client';

import React, { useState } from 'react';
import { DataTable } from '@components/admin/data-table/DataTable';
import { FormSheet } from '@components/admin/form/FormSheet';
import { useAdminListViewData } from '@hooks/useAdmin/useAdminListViewData';
import { API_LINKS } from 'app/links';
import { transformRawRole, useRoles } from '@hooks/useRoles';
import { T_RawRoleFields, T_RoleFields } from '@hooks/useRoles/types';
import { rolesTableColumns } from '@components/roles';
import CreateRoleView from './create-role-view';
import EditRoleView from './edit-role-view';
import i18next from 'i18next';

export function RolesListView() {
  const { selectedRoleIds, setSelectedRoleIds, deleteRoles } = useRoles();
  const [creatingRole, setCreatingRole] = useState(false);
  const [edittingRole, setEdittingRole] = useState<T_RoleFields | null>(null);

  const {
    items: roles,
    isLoading,
    mutate,
    loadMore,
    hasMore,
    error,
  } = useAdminListViewData<T_RoleFields, T_RawRoleFields>(
    API_LINKS.FETCH_USER_ROLES,
    'userRoles',
    transformRawRole,
  );

  const rowSelection = {
    selectedRowKeys: selectedRoleIds,
    onChange: (selectedRowKeys: React.Key[]) => {
      setSelectedRoleIds(selectedRowKeys);
    },
  };

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">{i18next.t('roles')}</h1>
      </div>

      <DataTable<T_RoleFields>
        deleteItems={async () => {
          const r = await deleteRoles();
          mutate();
          return r;
        }}
        rowSelection={rowSelection}
        items={roles}
        isLoading={isLoading}
        createNew={() => setCreatingRole(true)}
        editItem={(item) => setEdittingRole(item)}
        columns={rolesTableColumns}
        loadMore={loadMore}
        hasMore={hasMore}
        error={error}
      />

      <FormSheet
        open={creatingRole}
        onClose={() => setCreatingRole(false)}
        title={`Create ${i18next.t('roles')}`}
      >
        <CreateRoleView
          onSuccessfullyDone={() => {
            mutate();
            setCreatingRole(false);
          }}
        />
      </FormSheet>

      <FormSheet
        open={!!edittingRole}
        onClose={() => setEdittingRole(null)}
        title={`Edit ${i18next.t('roles')}`}
      >
        {edittingRole && (
          <EditRoleView
            role={edittingRole}
            onSuccessfullyDone={() => {
              mutate();
              setEdittingRole(null);
            }}
          />
        )}
      </FormSheet>
    </>
  );
}
