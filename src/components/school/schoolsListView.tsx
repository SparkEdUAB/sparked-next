'use client';

import { AdminPageTitle } from '@components/layouts';
import { ADMIN_LINKS } from '@components/layouts/adminLayout/links';
import useNavigation from '@hooks/useNavigation';
import useSchool from '@hooks/useSchool';
import { Input, Table } from 'antd';
import { Button, TextInput } from 'flowbite-react';
import i18next from 'i18next';
import React, { useEffect } from 'react';
import { HiOutlineNewspaper, HiOutlinePencilSquare, HiTrash, HiMagnifyingGlass } from 'react-icons/hi2';
import { schoolTableColumns } from '.';
import { TschoolFields } from './types';
import { observer } from 'mobx-react-lite';
import { AdminTable } from '@components/admin/AdminTable/AdminTable';
import { ItemTypeBase } from '@components/admin/AdminTable/types';
const { Search } = Input;

const SchoolsListView: React.FC = () => {
  const {
    fetchSchools,
    schools,
    selectedSchoolIds,
    setSelectedSchoolIds,
    triggerDelete,
    triggerEdit,
    findSchoolsByName,
    onSearchQueryChange,
    deleteSchools,
    isLoading,
  } = useSchool();
  const { router, getChildLinkByKey } = useNavigation();

  useEffect(() => {
    fetchSchools({});
  }, []);

  const rowSelection = {
    selectedRowKeys: selectedSchoolIds,
    onChange: (selectedRowKeys: React.Key[]) => {
      setSelectedSchoolIds(selectedRowKeys);
    },
  };

  return (
    <>
      <AdminPageTitle title={i18next.t('schools')} />

      <TextInput
        onChange={(e) => onSearchQueryChange(e.target.value)}
        icon={HiMagnifyingGlass}
        className="table-search-box"
        placeholder={i18next.t('search_schools')}
        required
        type="text"
        onKeyDown={(e) => {
          e.keyCode === 13 ? findSchoolsByName() : null;
        }}
      />
      <AdminTable
        deleteItems={deleteSchools}
        rowSelection={rowSelection}
        items={schools}
        isLoading={isLoading}
        createNewUrl={getChildLinkByKey('create', ADMIN_LINKS.schools)}
        getEditUrl={(id) => getChildLinkByKey('edit', ADMIN_LINKS.schools) + `?schoolId=${id}`}
        columns={schoolTableColumns}
      />
    </>
  );
};

export default observer(SchoolsListView);
