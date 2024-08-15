'use client';

import { AdminTable } from '@components/admin/AdminTable/AdminTable';
import { AdminPageTitle } from '@components/layouts';
import { rolesTableColumns } from '@components/roles';
import { useAdminListViewData } from '@hooks/useAdmin/useAdminListViewData';
import { transformRawRole, useRoles } from '@hooks/useRoles';
import { T_RawRoleFields, T_RoleFields } from '@hooks/useRoles/types';
import { API_LINKS } from 'app/links';
import { Button, Drawer, Modal } from 'flowbite-react';
import i18next from 'i18next';
import { useState } from 'react';
import { FaRegHandPointer } from 'react-icons/fa';
import { RiFileList2Line } from 'react-icons/ri';
import EditRoleView from './edit-role-view';
import CreateRoleView from './create-role-view';

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
  } = useAdminListViewData<T_RoleFields, T_RawRoleFields>(API_LINKS.FETCH_USER_ROLES, 'userRoles', transformRawRole);

  const rowSelection = {
    selectedRowKeys: selectedRoleIds,
    onChange: (selectedRowKeys: React.Key[]) => {
      setSelectedRoleIds(selectedRowKeys);
    },
  };

  return (
    <>
      <AdminPageTitle title={i18next.t('roles')} />

      <AdminTable<T_RoleFields>
        deleteItems={deleteRoles}
        rowSelection={rowSelection}
        items={roles}
        isLoading={isLoading}
        createNew={() => setCreatingRole(true)}
        editItem={setEdittingRole}
        columns={rolesTableColumns}
        loadMore={loadMore}
        hasMore={hasMore}
        error={error}
        additionalButtons={
          <>
            <Button className="rounded-none">
              <FaRegHandPointer className="mr-3 h-4 w-4" />
              Assign Actions
            </Button>
            <Button className="rounded-none">
              <RiFileList2Line className="mr-3 h-4 w-4" />
              Assign Pages
            </Button>
          </>
        }
      />
      <Modal dismissible show={creatingRole} onClose={() => setCreatingRole(false)} popup>
        <Modal.Header />
        <Modal.Body>
          <CreateRoleView
            onSuccessfullyDone={() => {
              mutate();
              setCreatingRole(false);
            }}
          />
        </Modal.Body>
      </Modal>
      <Drawer
        className="w-[360px] sm:w-[460px] lg:w-[560px]"
        open={!!edittingRole}
        onClose={() => setEdittingRole(null)}
        position="right"
      >
        <Drawer.Header titleIcon={() => <></>} />
        <Drawer.Items>
          {edittingRole ? (
            <EditRoleView
              role={edittingRole}
              onSuccessfullyDone={() => {
                mutate();
                setEdittingRole(null);
              }}
            />
          ) : null}
        </Drawer.Items>
      </Drawer>
    </>
  );
}
