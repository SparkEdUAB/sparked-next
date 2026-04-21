'use client';

import { AdminPageTitle } from '@components/layouts';
import useSchool, { transformRawSchool } from '@hooks/useSchool';
import { Dialog, DialogContent } from '@/components/ui/dialog';
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
  const [edittingSchool, setEdittingSchool] = useState<T_SchoolFields | null>(null);

  const {
    items: schools,
    isLoading,
    mutate,
    loadMore,
    hasMore,
    error,
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
        deleteItems={async () => {
          const result = await deleteSchools();
          mutate();
          return result;
        }}
        rowSelection={rowSelection}
        items={schools}
        isLoading={isLoading}
        createNew={() => setCreatingSchool(true)}
        editItem={(id) => setEdittingSchool(id)}
        columns={schoolTableColumns}
        onSearchQueryChange={onSearchQueryChange}
        hasMore={hasMore}
        loadMore={loadMore}
        error={error}
      />
      <Dialog open={creatingSchool} onOpenChange={setCreatingSchool}>
        <DialogContent>
          <CreateSchoolView
            onSuccessfullyDone={() => {
              mutate();
              setCreatingSchool(false);
            }}
          />
        </DialogContent>
      </Dialog>
      <Dialog open={!!edittingSchool} onOpenChange={(open) => { if (!open) setEdittingSchool(null); }}>
        <DialogContent>
          {edittingSchool ? (
            <EditSchoolView
              schoolId={edittingSchool._id}
              onSuccessfullyDone={() => {
                mutate();
                setEdittingSchool(null);
              }}
            />
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SchoolsListView;
