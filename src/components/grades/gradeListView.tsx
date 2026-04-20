'use client';

import React, { useState } from 'react';
import { DataTable } from '@components/admin/data-table/DataTable';
import { FormSheet } from '@components/admin/form/FormSheet';
import { useAdminListViewData } from '@hooks/useAdmin/useAdminListViewData';
import { API_LINKS } from 'app/links';
import useGrade, { transformRawGrade } from '@hooks/useGrade';
import { T_GradeFields } from '@hooks/useGrade/types';
import { gradeTableColumns } from '.';
import EditGradeView from './editGradeView';
import CreateGradeView from './createGradeView';
import i18next from 'i18next';

const GradeListView: React.FC = () => {
  const { selectedGradeIds, setSelectedGradeIds, onSearchQueryChange, deleteGrade, searchQuery } =
    useGrade();
  const [creatingGrade, setCreatingGrade] = useState(false);
  const [edittingGrade, setEdittingGrade] = useState<T_GradeFields | null>(null);

  const { items: grades, isLoading, mutate, loadMore, hasMore, error } = useAdminListViewData(
    API_LINKS.FETCH_GRADES,
    'grades',
    transformRawGrade,
    API_LINKS.FIND_GRADE_BY_NAME,
    searchQuery,
  );

  const rowSelection = {
    selectedRowKeys: selectedGradeIds,
    onChange: (selectedRowKeys: React.Key[]) => setSelectedGradeIds(selectedRowKeys),
  };

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">{i18next.t('grades')}</h1>
      </div>

      <DataTable<T_GradeFields>
        deleteItems={async () => { const r = await deleteGrade(); mutate(); return r; }}
        rowSelection={rowSelection}
        items={grades}
        isLoading={isLoading}
        createNew={() => setCreatingGrade(true)}
        editItem={(item) => setEdittingGrade(item)}
        columns={gradeTableColumns}
        onSearchQueryChange={onSearchQueryChange}
        hasMore={hasMore}
        loadMore={loadMore}
        error={error}
      />

      <FormSheet
        open={creatingGrade}
        onClose={() => setCreatingGrade(false)}
        title={`Create ${i18next.t('grades')}`}
      >
        <CreateGradeView
          onSuccessfullyDone={() => { mutate(); setCreatingGrade(false); }}
        />
      </FormSheet>

      <FormSheet
        open={!!edittingGrade}
        onClose={() => setEdittingGrade(null)}
        title={`Edit ${i18next.t('grades')}`}
      >
        {edittingGrade && (
          <EditGradeView
            grade={edittingGrade}
            onSuccessfullyDone={() => { mutate(); setEdittingGrade(null); }}
          />
        )}
      </FormSheet>
    </>
  );
};

export default GradeListView;
