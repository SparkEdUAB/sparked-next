'use client';

import useProgram, { transformRawProgram } from '@hooks/useProgram';
import i18next from 'i18next';
import React, { useState } from 'react';
import { programTableColumns } from '.';
import { DataTable } from '@components/admin/data-table/DataTable';
import { FormSheet } from '@components/admin/form/FormSheet';
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
    loadMore,
    hasMore,
    error,
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
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">{i18next.t('programs')}</h1>
      </div>

      <DataTable<T_ProgramFields>
        deleteItems={async () => {
          const result = await deletePrograms();
          mutate();
          return result;
        }}
        rowSelection={rowSelection}
        items={programs}
        isLoading={isLoading}
        createNew={() => setCreatingProgram(true)}
        editItem={(item) => setEdittingProgram(item)}
        columns={programTableColumns}
        onSearchQueryChange={onSearchQueryChange}
        hasMore={hasMore}
        loadMore={loadMore}
        error={error}
      />

      <FormSheet
        open={creatingProgram}
        onClose={() => setCreatingProgram(false)}
        title={`Create ${i18next.t('programs')}`}
      >
        <CreateProgramView
          onSuccessfullyDone={() => {
            mutate();
            setCreatingProgram(false);
          }}
        />
      </FormSheet>

      <FormSheet
        open={!!edittingProgram}
        onClose={() => setEdittingProgram(null)}
        title={`Edit ${i18next.t('programs')}`}
      >
        {edittingProgram && (
          <EditProgramView
            programId={edittingProgram._id}
            onSuccessfullyDone={() => {
              mutate();
              setEdittingProgram(null);
            }}
          />
        )}
      </FormSheet>
    </>
  );
};

export default ProgramsListView;
