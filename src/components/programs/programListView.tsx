'use client';

import { AdminPageTitle } from '@components/layouts';
import useProgram, { transformRawProgram } from '@hooks/useProgram';
import { Modal } from 'flowbite-react';
import i18next from 'i18next';
import React, { useState } from 'react';
import { programTableColumns } from '.';
import { AdminTable } from '@components/admin/AdminTable/AdminTable';
import CreateProgramView from './createProgramView';
import EditProgramView from './editProgramView';
import { useAdminListViewData } from '@hooks/useAdmin/useAdminListViewData';
import { API_LINKS } from 'app/links';
import { T_ProgramFields } from '@hooks/useProgram/types';

const ProgramsListView: React.FC = () => {
  const { selectedProgramIds, setSelectedProgramIds, onSearchQueryChange, deletePrograms, searchQuery } = useProgram();
  const [creatingProgram, setCreatingProgram] = useState(false);
  const [edittingProgram, setEdittingProgram] = useState<T_ProgramFields | null>(null);

  const {
    items: programs,
    isLoading,
    mutate,
  } = useAdminListViewData(
    API_LINKS.FETCH_PROGRAMS,
    'programs',
    transformRawProgram,
    API_LINKS.FIND_PROGRAMS_BY_NAME,
    searchQuery,
  );

  const rowSelection = {
    selectedRowKeys: selectedProgramIds,
    onChange: (selectedRowKeys: React.Key[]) => {
      setSelectedProgramIds(selectedRowKeys);
    },
  };

  return (
    <>
      <AdminPageTitle title={i18next.t('programs')} />

      <AdminTable<T_ProgramFields>
        deleteItems={deletePrograms}
        rowSelection={rowSelection}
        items={programs}
        isLoading={isLoading}
        createNew={() => setCreatingProgram(true)}
        editItem={(item) => setEdittingProgram(item)}
        columns={programTableColumns}
        onSearchQueryChange={onSearchQueryChange}
      />
      <Modal dismissible show={creatingProgram} onClose={() => setCreatingProgram(false)} popup>
        <Modal.Header />
        <Modal.Body>
          <CreateProgramView
            onSuccessfullyDone={() => {
              mutate();
              setCreatingProgram(false);
            }}
          />
        </Modal.Body>
      </Modal>
      <Modal dismissible show={!!edittingProgram} onClose={() => setEdittingProgram(null)} popup>
        <Modal.Header />
        <Modal.Body>
          {edittingProgram ? (
            <EditProgramView
              programId={edittingProgram._id}
              onSuccessfullyDone={() => {
                mutate();
                setEdittingProgram(null);
              }}
            />
          ) : null}
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ProgramsListView;
