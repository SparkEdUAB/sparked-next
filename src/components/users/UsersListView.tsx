'use client';

import { AdminPageTitle } from '@components/layouts';
import { ADMIN_LINKS } from '@components/layouts/adminLayout/links';
import useNavigation from '@hooks/useNavigation';
import useUser from '@hooks/useUser';
import { Modal, TextInput } from 'flowbite-react';
import i18next from 'i18next';
import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import { HiMagnifyingGlass } from 'react-icons/hi2';
import { userTableColumns } from '.';
import { AdminTable } from '@components/admin/AdminTable/AdminTable';
import { T_UserFields } from '@hooks/useUser/types';
import CreateUserView from './create-user-view';
import EditUserView from './edit-unit-view';

const UsersListView = observer(() => {
  const {
    fetchUnits,
    users,
    selectedUserIds,
    setSelectedUserIds,
    findUsersByName,
    onSearchQueryChange,
    isLoading,
    deleteUsers,
  } = useUser();
  const { getChildLinkByKey } = useNavigation();
  const [creatingUser, setCreatingUser] = useState(false);
  const [edittingUserWithId, setEdittingUserWithId] = useState<string | null>(null);

  useEffect(() => {
    fetchUnits({});
  }, []);

  const rowSelection = {
    selectedRowKeys: selectedUserIds,
    onChange: (selectedRowKeys: React.Key[]) => {
      setSelectedUserIds(selectedRowKeys);
    },
  };

  return (
    <>
      <AdminPageTitle title={i18next.t('users')} />

      <TextInput
        onChange={(e) => onSearchQueryChange(e.target.value)}
        icon={HiMagnifyingGlass}
        className="table-search-box"
        placeholder={i18next.t('search_users')}
        required
        type="text"
        onKeyDown={(e) => {
          e.keyCode === 13 ? findUsersByName({ withMetaData: true }) : null;
        }}
      />
      <AdminTable<T_UserFields>
        deleteItems={deleteUsers}
        rowSelection={rowSelection}
        items={users || []}
        isLoading={isLoading}
        //createNewUrl={getChildLinkByKey('create', ADMIN_LINKS.users)}
        //getEditUrl={(id: string) => getChildLinkByKey('edit', ADMIN_LINKS.units) + `?unitId=${id}`}
        createNew={() => setCreatingUser(true)}
        editItem={(id) => setEdittingUserWithId(id)}
        columns={userTableColumns}
      />
      {/*<Modal dismissible show={creatingUser} onClose={() => setCreatingUser(false)} popup>
        <Modal.Header />
        <Modal.Body>
          <CreateUserView
            onSuccessfullyDone={() => {
              fetchUsers({});
              setCreatingUser(false);
            }}
          />
        </Modal.Body>
      </Modal>
      <Modal dismissible show={!!edittingUserWithId} onClose={() => setEdittingUserWithId(null)} popup>
        <Modal.Header />
        <Modal.Body>
          {edittingUserWithId ? (
            <EditUserView
              courseId={edittingUserWithId}
              onSuccessfullyDone={() => {
                fetchUsers({});
                setEdittingUserWithId(null);
              }}
            />
          ) : null}
        </Modal.Body>
      </Modal>*/}
    </>
  );
});

export default UsersListView;
