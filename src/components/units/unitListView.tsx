'use client';

import React, { useState } from 'react';
import { DataTable } from '@components/admin/data-table/DataTable';
import { FormSheet } from '@components/admin/form/FormSheet';
import { useAdminListViewData } from '@hooks/useAdmin/useAdminListViewData';
import { API_LINKS } from 'app/links';
import useUnit, { transformRawUnit } from '@hooks/useUnit';
import { T_UnitFields } from '@hooks/useUnit/types';
import { unitTableColumns } from '.';
import CreateUnitView from './create-unit-view';
import EditUnitView from './edit-unit-view';
import i18next from 'i18next';

const UnitListView: React.FC = () => {
  const { selectedUnitIds, setSelectedProgramIds, searchQuery, onSearchQueryChange, deleteUnits } =
    useUnit();
  const [creatingUnit, setCreatingUnit] = useState(false);
  const [edittingUnit, setEdittingUnit] = useState<T_UnitFields | null>(null);

  const { items: units, isLoading, mutate, loadMore, hasMore, error } = useAdminListViewData(
    API_LINKS.FETCH_UNITS,
    'units',
    transformRawUnit,
    API_LINKS.FIND_UNITS_BY_NAME,
    searchQuery,
  );

  const rowSelection = {
    selectedRowKeys: selectedUnitIds,
    onChange: (selectedRowKeys: React.Key[]) => setSelectedProgramIds(selectedRowKeys),
  };

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">{i18next.t('units')}</h1>
      </div>

      <DataTable<T_UnitFields>
        deleteItems={async () => { const r = await deleteUnits(); mutate(); return r; }}
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

      <FormSheet
        open={creatingUnit}
        onClose={() => setCreatingUnit(false)}
        title={`Create ${i18next.t('units')}`}
      >
        <CreateUnitView
          onSuccessfullyDone={() => { mutate(); setCreatingUnit(false); }}
        />
      </FormSheet>

      <FormSheet
        open={!!edittingUnit}
        onClose={() => setEdittingUnit(null)}
        title={`Edit ${i18next.t('units')}`}
      >
        {edittingUnit && (
          <EditUnitView
            unit={edittingUnit}
            onSuccessfullyDone={() => { mutate(); setEdittingUnit(null); }}
          />
        )}
      </FormSheet>
    </>
  );
};

export default UnitListView;
