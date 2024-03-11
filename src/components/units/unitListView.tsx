'use client';

import { AdminPageTitle } from '@components/layouts';
import { ADMIN_LINKS } from '@components/layouts/adminLayout/links';
import useNavigation from '@hooks/useNavigation';
import useUnit from '@hooks/useUnit';
import { Table } from 'antd';
import { Button, TextInput } from 'flowbite-react';
import i18next from 'i18next';
import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import { HiMagnifyingGlass, HiOutlineNewspaper, HiOutlinePencilSquare, HiTrash } from 'react-icons/hi2';
import { unitTableColumns } from '.';
import { AdminTable } from '@components/admin/AdminTable/AdminTable';
import { ItemTypeBase } from '@components/admin/AdminTable/types';
import { TUnitFields } from '@hooks/useUnit/types';

const UnitListView: React.FC = observer(() => {
  const {
    fetchUnits,
    units,
    selectedUnitIds,
    setSelectedProgramIds,
    triggerDelete,
    triggerEdit,
    findUnitsByName,
    onSearchQueryChange,
    deleteUnits,
    isLoading,
  } = useUnit();
  const { router, getChildLinkByKey } = useNavigation();

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
      <AdminPageTitle title={i18next.t('units')} />

      <TextInput
        onChange={(e) => onSearchQueryChange(e.target.value)}
        icon={HiMagnifyingGlass}
        className="table-search-box"
        placeholder={i18next.t('search_units')}
        required
        type="text"
        onKeyDown={(e) => {
          e.keyCode === 13 ? findUnitsByName({ withMetaData: true }) : null;
        }}
      />
      <AdminTable
        deleteItems={deleteUnits}
        rowSelection={rowSelection}
        items={units}
        isLoading={isLoading}
        createNewUrl={getChildLinkByKey('create', ADMIN_LINKS.units)}
        getEditUrl={(id) => getChildLinkByKey('edit', ADMIN_LINKS.units) + `?unitId=${id}`}
        columns={unitTableColumns}
      />
    </>
  );
});

export default UnitListView;
