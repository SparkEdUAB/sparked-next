'use client';

import { AdminTable } from '@components/admin/AdminTable/AdminTable';
import { AdminPageTitle } from '@components/layouts';
import useUnit, { transformRawUnit } from '@hooks/useUnit';
import { Drawer, Modal } from 'flowbite-react';
import i18next from 'i18next';
import React, { useState } from 'react';
import { unitTableColumns } from '.';
import CreateUnitView from './create-unit-view';
import EditUnitView from './edit-unit-view';
import { useAdminListViewData } from '@hooks/useAdmin/useAdminListViewData';
import { API_LINKS } from 'app/links';
import { T_UnitFields } from '@hooks/useUnit/types';

const UnitListView: React.FC = () => {
  const { selectedUnitIds, setSelectedProgramIds, searchQuery, onSearchQueryChange, deleteUnits } = useUnit();
  const [creatingUnit, setCreatingUnit] = useState(false);
  const [edittingUnit, setEdittingUnit] = useState<T_UnitFields | null>(null);

  const {
    items: units,
    isLoading,
    mutate,
    loadMore,
    hasMore,
    error,
  } = useAdminListViewData(API_LINKS.FETCH_UNITS, 'units', transformRawUnit, API_LINKS.FIND_UNITS_BY_NAME, searchQuery);

  const rowSelection = {
    selectedRowKeys: selectedUnitIds,
    onChange: (selectedRowKeys: React.Key[]) => {
      setSelectedProgramIds(selectedRowKeys);
    },
  };

  return (
    <>
      <AdminPageTitle title={i18next.t('units')} />

      <AdminTable<T_UnitFields>
        deleteItems={deleteUnits}
        rowSelection={rowSelection}
        items={units}
        isLoading={isLoading}
        createNew={() => setCreatingUnit(true)}
        editItem={(id) => setEdittingUnit(id)}
        columns={unitTableColumns}
        onSearchQueryChange={onSearchQueryChange}
        hasMore={hasMore}
        loadMore={loadMore}
        error={error}
      />
      <Modal dismissible show={creatingUnit} onClose={() => setCreatingUnit(false)} popup>
        <Modal.Header />
        <Modal.Body>
          <CreateUnitView
            onSuccessfullyDone={() => {
              mutate();
              setCreatingUnit(false);
            }}
          />
        </Modal.Body>
      </Modal>
      <Drawer
        className="w-[360px] sm:w-[460px] lg:w-[560px]"
        open={!!edittingUnit}
        onClose={() => setEdittingUnit(null)}
        position="right"
      >
        <Drawer.Header titleIcon={() => <></>} />
        <Drawer.Items>
          {edittingUnit ? (
            <EditUnitView
              unit={edittingUnit}
              onSuccessfullyDone={() => {
                mutate();
                setEdittingUnit(null);
              }}
            />
          ) : null}
        </Drawer.Items>
      </Drawer>
    </>
  );
};

export default UnitListView;
