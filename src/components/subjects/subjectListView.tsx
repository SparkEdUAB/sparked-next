'use client';

import React, { useState } from 'react';
import { DataTable } from '@components/admin/data-table/DataTable';
import { FormSheet } from '@components/admin/form/FormSheet';
import { useAdminListViewData } from '@hooks/useAdmin/useAdminListViewData';
import { API_LINKS } from 'app/links';
import useSubject, { transformRawSubject } from '@hooks/useSubject';
import { T_SubjectFields } from '@hooks/useSubject/types';
import { subjectTableColumns } from '.';
import EditSubjectView from './editSubjectView';
import CreateSubjectView from './createSubjectView';
import i18next from 'i18next';

const SubjectListView: React.FC = () => {
  const { selectedSubjectIds, setSelectedSubjectIds, onSearchQueryChange, deleteSubject, searchQuery } =
    useSubject();
  const [creatingSubject, setCreatingSubject] = useState(false);
  const [edittingSubject, setEdittingSubject] = useState<T_SubjectFields | null>(null);

  const { items: subjects, isLoading, mutate, loadMore, hasMore, error } = useAdminListViewData(
    API_LINKS.FETCH_SUBJECTS,
    'subjects',
    transformRawSubject,
    API_LINKS.FIND_SUBJECT_BY_NAME,
    searchQuery,
  );

  const rowSelection = {
    selectedRowKeys: selectedSubjectIds,
    onChange: (selectedRowKeys: React.Key[]) => setSelectedSubjectIds(selectedRowKeys),
  };

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">{i18next.t('subjects')}</h1>
      </div>

      <DataTable<T_SubjectFields>
        deleteItems={async () => { const r = await deleteSubject(); mutate(); return r; }}
        rowSelection={rowSelection}
        items={subjects}
        isLoading={isLoading}
        createNew={() => setCreatingSubject(true)}
        editItem={(item) => setEdittingSubject(item)}
        columns={subjectTableColumns}
        onSearchQueryChange={onSearchQueryChange}
        hasMore={hasMore}
        loadMore={loadMore}
        error={error}
      />

      <FormSheet
        open={creatingSubject}
        onClose={() => setCreatingSubject(false)}
        title={`Create ${i18next.t('subjects')}`}
      >
        <CreateSubjectView
          onSuccessfullyDone={() => { mutate(); setCreatingSubject(false); }}
        />
      </FormSheet>

      <FormSheet
        open={!!edittingSubject}
        onClose={() => setEdittingSubject(null)}
        title={`Edit ${i18next.t('subjects')}`}
      >
        {edittingSubject && (
          <EditSubjectView
            subject={edittingSubject}
            onSuccessfullyDone={() => { mutate(); setEdittingSubject(null); }}
          />
        )}
      </FormSheet>
    </>
  );
};

export default SubjectListView;
