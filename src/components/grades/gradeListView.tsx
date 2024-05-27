'use client';

import { AdminPageTitle } from '@components/layouts';
import { Drawer, Modal } from 'flowbite-react';
import i18next from 'i18next';
import React, { useState } from 'react';
import useGrade, { transformRawGrade } from '@hooks/useGrade';
import { T_GradeFields } from '@hooks/useGrade/types';
import { AdminTable } from '../admin/AdminTable/AdminTable';
import { gradeTableColumns } from '.';
import EditGradeView from './editGradeView';
import CreateGradeView from './createGradeView';
import { API_LINKS } from 'app/links';
import { useAdminListViewData } from '@hooks/useAdmin/useAdminListViewData';

const GradeListView: React.FC = () => {
  const { selectedGradeIds, setSelectedGradeIds, onSearchQueryChange, deleteGrade, searchQuery } = useGrade();
  const [creatingGrade, setCreatingGrade] = useState(false);
  const [edittingGrade, setEdittingGrade] = useState<T_GradeFields | null>(null);

  const {
    items: grades,
    isLoading,
    mutate,
    loadMore,
    hasMore,
    error,
  } = useAdminListViewData(
    API_LINKS.FETCH_GRADES,
    'grades',
    transformRawGrade,
    API_LINKS.FIND_GRADE_BY_NAME,
    searchQuery,
  );

  const rowSelection = {
    selectedRowKeys: selectedGradeIds,
    onChange: (selectedRowKeys: React.Key[]) => {
      setSelectedGradeIds(selectedRowKeys);
    },
  };

  return (
    <>
      <AdminPageTitle title={i18next.t('grades')} />

      <AdminTable<T_GradeFields>
        deleteItems={deleteGrade}
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
      <Modal dismissible show={creatingGrade} onClose={() => setCreatingGrade(false)} popup>
        <Modal.Header />
        <Modal.Body>
          <CreateGradeView
            onSuccessfullyDone={() => {
              mutate();
              setCreatingGrade(false);
            }}
          />
        </Modal.Body>
      </Modal>
      <Drawer
        className="w-[360px] sm:w-[460px] lg:w-[560px]"
        open={!!edittingGrade}
        onClose={() => setEdittingGrade(null)}
        position="right"
      >
        <Drawer.Header titleIcon={() => <></>} />
        <Drawer.Items>
          {edittingGrade ? (
            <EditGradeView
              grade={edittingGrade}
              onSuccessfullyDone={() => {
                mutate();
                setEdittingGrade(null);
              }}
            />
          ) : null}
        </Drawer.Items>
      </Drawer>
    </>
  );
};

export default GradeListView;
