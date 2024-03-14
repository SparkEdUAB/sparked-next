'use client';

import { AdminPageTitle } from '@components/layouts';
import { ADMIN_LINKS } from '@components/layouts/adminLayout/links';
import useNavigation from '@hooks/useNavigation';
import useUser from '@hooks/useUser';
import { TextInput } from 'flowbite-react';
import i18next from 'i18next';
import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import { HiMagnifyingGlass } from 'react-icons/hi2';
import { userTableColumns } from '.';
import { AdminTable } from '@components/admin/AdminTable/AdminTable';
import { TUserFields } from '@hooks/useUser/types';

const UsersListView: React.FC = observer(() => {
  const {
    fetchUnits,
    users,
    selectedUserIds,
    setSelectedUserIds,
    triggerDelete,
    triggerEdit,
    findUsersByName,
    onSearchQueryChange,
    isLoading,
    deleteUsers,
  } = useUser();
  const { getChildLinkByKey } = useNavigation();

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
      {/* <AdminTable<TUserFields>
        deleteItems={deleteUsers}
        rowSelection={rowSelection}
        items={users || []}
        isLoading={isLoading}
        createNewUrl={getChildLinkByKey('create', ADMIN_LINKS.users)}
        getEditUrl={(id: string) => getChildLinkByKey('edit', ADMIN_LINKS.units) + `?unitId=${id}`}
        columns={userTableColumns}
      /> */}
    </>
  );
});

export default UsersListView;
