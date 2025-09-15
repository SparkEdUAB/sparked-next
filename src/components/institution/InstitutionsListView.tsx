'use client';

import { AdminPageTitle } from '@components/layouts';
import useInstitution, { transformRawInstitution } from '@hooks/useInstitution';
import { Modal } from 'flowbite-react';
import React, { useState } from 'react';
import { institutionTableColumns } from './index';
import { AdminTable } from '@components/admin/AdminTable/AdminTable';
import CreateInstitutionView from './CreateInstitutionView';
import EditInstitutionView from './EditInstitutionView';
import { useAdminListViewData } from '@hooks/useAdmin/useAdminListViewData';
import { API_LINKS } from 'app/links';
import { T_InstitutionFields } from '@hooks/useInstitution/types';

const InstitutionsListView: React.FC = () => {
  const { selectedInstitutionIds, setSelectedInstitutionIds, onSearchQueryChange, deleteInstitutions, searchQuery } = useInstitution();
  const [creatingInstitution, setCreatingInstitution] = useState(false);
  const [edittingInstitution, setEdittingInstitution] = useState<T_InstitutionFields | null>(null);

  const {
    items: institutions,
    isLoading,
    mutate,
    loadMore,
    hasMore,
    error,
  } = useAdminListViewData(
    API_LINKS.FETCH_INSTITUTIONS,
    'institutions',
    transformRawInstitution,
    API_LINKS.FIND_INSTITUTIONS_BY_NAME,
    searchQuery,
  );

  const rowSelection = {
    selectedRowKeys: selectedInstitutionIds,
    onChange: (selectedRowKeys: React.Key[]) => {
      setSelectedInstitutionIds(selectedRowKeys);
    },
  };

  return (
    <>
      <AdminPageTitle title="Institutions" />

      <AdminTable<T_InstitutionFields>
        deleteItems={async () => {
          const result = await deleteInstitutions();
          mutate();
          return !!result;
        }}
        rowSelection={rowSelection}
        items={institutions}
        isLoading={isLoading}
        createNew={() => setCreatingInstitution(true)}
        editItem={(item) => setEdittingInstitution(item)}
        columns={institutionTableColumns}
        onSearchQueryChange={onSearchQueryChange}
        hasMore={hasMore}
        loadMore={loadMore}
        error={error}
      />

      <Modal show={creatingInstitution} onClose={() => setCreatingInstitution(false)} size="2xl">
        <Modal.Header>Create Institution</Modal.Header>
        <Modal.Body>
          <CreateInstitutionView
            onSuccessfullyDone={() => {
              setCreatingInstitution(false);
              mutate();
            }}
          />
        </Modal.Body>
      </Modal>

      <Modal show={!!edittingInstitution} onClose={() => setEdittingInstitution(null)} size="2xl">
        <Modal.Header>Edit Institution</Modal.Header>
        <Modal.Body>
          {edittingInstitution && (
            <EditInstitutionView
              institution={edittingInstitution}
              onSuccessfullyDone={() => {
                setEdittingInstitution(null);
                mutate();
              }}
            />
          )}
        </Modal.Body>
      </Modal>
    </>
  );
};

export default InstitutionsListView;