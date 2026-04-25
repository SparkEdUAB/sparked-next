'use client';

import useSchool, { transformRawSchool } from '@hooks/useSchool';
import i18next from 'i18next';
import React, { useState } from 'react';
import { schoolTableColumns } from '.';
import { DataTable } from '@components/admin/data-table/DataTable';
import { FormSheet } from '@components/admin/form/FormSheet';
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
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">{i18next.t('schools')}</h1>
      </div>

      <DataTable<T_SchoolFields>
        deleteItems={async () => {
          const result = await deleteSchools();
          mutate();
          return result;
        }}
        rowSelection={rowSelection}
        items={schools}
        isLoading={isLoading}
        createNew={() => setCreatingSchool(true)}
        editItem={(item) => setEdittingSchool(item)}
        columns={schoolTableColumns}
        onSearchQueryChange={onSearchQueryChange}
        hasMore={hasMore}
        loadMore={loadMore}
        error={error}
      />

      <FormSheet
        open={creatingSchool}
        onClose={() => setCreatingSchool(false)}
        title={`Create ${i18next.t('schools')}`}
      >
        <CreateSchoolView
          onSuccessfullyDone={() => {
            mutate();
            setCreatingSchool(false);
          }}
        />
      </FormSheet>

      <FormSheet
        open={!!edittingSchool}
        onClose={() => setEdittingSchool(null)}
        title={`Edit ${i18next.t('schools')}`}
      >
        {edittingSchool && (
          <EditSchoolView
            schoolId={edittingSchool._id}
            onSuccessfullyDone={() => {
              mutate();
              setEdittingSchool(null);
            }}
          />
        )}
      </FormSheet>
    </>
  );
};

export default SchoolsListView;
