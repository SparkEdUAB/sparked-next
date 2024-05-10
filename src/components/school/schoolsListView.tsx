'use client';

import { AdminPageTitle } from '@components/layouts';
import useSchool, { transformRawSchool } from '@hooks/useSchool';
import { Modal } from 'flowbite-react';
import i18next from 'i18next';
import React, { useState } from 'react';
import { schoolTableColumns } from '.';
import { AdminTable } from '@components/admin/AdminTable/AdminTable';
import CreateSchoolView from './createSchoolView';
import EditSchoolView from './editSchoolView';
import { useAdminListViewData } from '@hooks/useAdmin/useAdminListViewData';
import { API_LINKS } from 'app/links';
import { T_SchoolFields } from './types';

const SchoolsListView: React.FC = () => {
  const { selectedSchoolIds, setSelectedSchoolIds, onSearchQueryChange, deleteSchools, searchQuery } = useSchool();
  const [creatingSchool, setCreatingSchool] = useState(false);
  const [edittingSchoolWithId, setEdittingSchoolWithId] = useState<string | null>(null);

  const {
    items: schools,
    isLoading,
    mutate,
  } = useAdminListViewData(
    API_LINKS.FETCH_SCHOOLS,
    'schools',
    transformRawSchool,
    API_LINKS.FIND_SCHOOLS_BY_NAME,
    searchQuery,
  );

  const rowSelection = {
    selectedRowKeys: selectedSchoolIds,
    onChange: (selectedRowKeys: React.Key[]) => {
      setSelectedSchoolIds(selectedRowKeys);
    },
  };

  return (
    <>
      <AdminPageTitle title={i18next.t('schools')} />

      <AdminTable<T_SchoolFields>
        deleteItems={deleteSchools}
        rowSelection={rowSelection}
        items={schools}
        isLoading={isLoading}
        createNew={() => setCreatingSchool(true)}
        editItem={(id) => setEdittingSchoolWithId(id)}
        columns={schoolTableColumns}
        onSearchQueryChange={onSearchQueryChange}
      />
      <Modal dismissible show={creatingSchool} onClose={() => setCreatingSchool(false)} popup>
        <Modal.Header />
        <Modal.Body>
          <CreateSchoolView
            onSuccessfullyDone={() => {
              mutate();
              setCreatingSchool(false);
            }}
          />
        </Modal.Body>
      </Modal>
      <Modal dismissible show={!!edittingSchoolWithId} onClose={() => setEdittingSchoolWithId(null)} popup>
        <Modal.Header />
        <Modal.Body>
          {edittingSchoolWithId ? (
            <EditSchoolView
              schoolId={edittingSchoolWithId}
              onSuccessfullyDone={() => {
                mutate();
                setEdittingSchoolWithId(null);
              }}
            />
          ) : null}
        </Modal.Body>
      </Modal>
    </>
  );
};

export default SchoolsListView;
