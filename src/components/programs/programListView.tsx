'use client';

import { AdminPageTitle } from '@components/layouts';
import useProgram, { transformRawProgram } from '@hooks/useProgram';
import { Dialog, DialogContent } from '@/components/ui/dialog';
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
      <AdminPageTitle title={i18next.t('programs')} />

      <AdminTable<T_ProgramFields>
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
      <Dialog open={creatingProgram} onOpenChange={setCreatingProgram}>
        <DialogContent>
          <CreateProgramView
            onSuccessfullyDone={() => {
              mutate();
              setCreatingProgram(false);
            }}
          />
        </DialogContent>
      </Dialog>
      <Dialog open={!!edittingProgram} onOpenChange={(open) => { if (!open) setEdittingProgram(null); }}>
        <DialogContent>
          {edittingProgram ? (
            <EditProgramView
              programId={edittingProgram._id}
              onSuccessfullyDone={() => {
                mutate();
                setEdittingProgram(null);
              }}
            />
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProgramsListView;
