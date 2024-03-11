'use client';

import { AdminPageTitle } from '@components/layouts';
import { ADMIN_LINKS } from '@components/layouts/adminLayout/links';
import useNavigation from '@hooks/useNavigation';
import useUnit from '@hooks/useUser';
import { TextInput } from 'flowbite-react';
import i18next from 'i18next';
import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import { HiMagnifyingGlass } from 'react-icons/hi2';
import { unitTableColumns } from '.';
import { AdminTable } from '@components/admin/AdminTable/AdminTable';
import { TUnitFields } from '@hooks/useUser/types';

const UsersListView: React.FC = observer(() => {
  const {
    fetchUnits,
    units,
    selectedUnitIds,
    setSelectedProgramIds,
    triggerDelete,
    triggerEdit,
    findUnitsByName,
    onSearchQueryChange,
    isLoading,
    deleteUnits,
  } = useUnit();
  const { getChildLinkByKey } = useNavigation();

  useEffect(() => {
    fetchUnits({});
  }, []);

  const rowSelection = {
    selectedRowKeys: selectedUnitIds,
    onChange: (selectedRowKeys: React.Key[]) => {
      setSelectedProgramIds(selectedRowKeys);
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
          e.keyCode === 13 ? findUnitsByName({ withMetaData: true }) : null;
        }}
      />
      <AdminTable<TUnitFields>
        deleteItems={deleteUnits}
        rowSelection={rowSelection}
        items={units || []}
        isLoading={isLoading}
        createNewUrl={getChildLinkByKey('create', ADMIN_LINKS.users)}
        getEditUrl={(id: string) => getChildLinkByKey('edit', ADMIN_LINKS.units) + `?unitId=${id}`}
        columns={unitTableColumns}
      />
    </>
  );
});

export default UsersListView;
