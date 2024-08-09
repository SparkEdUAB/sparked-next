'use client';

import { AdminPageTitle } from '@components/layouts';
import { Drawer, Modal } from 'flowbite-react';
import i18next from 'i18next';
import React, { useState } from 'react';
import useSubject, { transformRawSubject } from '@hooks/useSubject';
import { T_SubjectFields } from '@hooks/useSubject/types';
import { AdminTable } from '../admin/AdminTable/AdminTable';
import { subjectTableColumns } from '.';
import EditSubjectView from './editSubjectView';
import CreateSubjectView from './createSubjectView';
import { API_LINKS } from 'app/links';
import { useAdminListViewData } from '@hooks/useAdmin/useAdminListViewData';

const SubjectListView: React.FC = () => {
  const { selectedSubjectIds, setSelectedSubjectIds, onSearchQueryChange, deleteSubject, searchQuery } = useSubject();
  const [creatingSubject, setCreatingSubject] = useState(false);
  const [edittingSubject, setEdittingSubject] = useState<T_SubjectFields | null>(null);

  const {
    items: subjects,
    isLoading,
    mutate,
    loadMore,
    hasMore,
    error,
  } = useAdminListViewData(
    API_LINKS.FETCH_SUBJECTS,
    'subjects',
    transformRawSubject,
    API_LINKS.FIND_SUBJECT_BY_NAME,
    searchQuery,
  );

  const rowSelection = {
    selectedRowKeys: selectedSubjectIds,
    onChange: (selectedRowKeys: React.Key[]) => {
      setSelectedSubjectIds(selectedRowKeys);
    },
  };

  return (
    <>
      <AdminPageTitle title={i18next.t('subjects')} />

      <AdminTable<T_SubjectFields>
        deleteItems={async () => {
          const result = await deleteSubject();
          mutate();
          return result;
        }}
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
      <Modal dismissible show={creatingSubject} onClose={() => setCreatingSubject(false)} popup>
        <Modal.Header />
        <Modal.Body>
          <CreateSubjectView
            onSuccessfullyDone={() => {
              mutate();
              setCreatingSubject(false);
            }}
          />
        </Modal.Body>
      </Modal>
      <Drawer
        className="w-[360px] sm:w-[460px] lg:w-[560px]"
        open={!!edittingSubject}
        onClose={() => setEdittingSubject(null)}
        position="right"
      >
        <Drawer.Header titleIcon={() => <></>} />
        <Drawer.Items>
          {edittingSubject ? (
            <EditSubjectView
              subject={edittingSubject}
              onSuccessfullyDone={() => {
                mutate();
                setEdittingSubject(null);
              }}
            />
          ) : null}
        </Drawer.Items>
      </Drawer>
    </>
  );
};

export default SubjectListView;
