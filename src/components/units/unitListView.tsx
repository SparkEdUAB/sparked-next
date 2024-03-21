'use client';

import { AdminPageTitle } from '@components/layouts';
import { ADMIN_LINKS } from '@components/layouts/adminLayout/links';
import useNavigation from '@hooks/useNavigation';
import useUnit from '@hooks/useUnit';
import { Modal, TextInput } from 'flowbite-react';
import i18next from 'i18next';
import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import { HiMagnifyingGlass } from 'react-icons/hi2';
import { unitTableColumns } from '.';
import { AdminTable } from '@components/admin/AdminTable/AdminTable';
import CreateUnitView from './create-unit-view';
import EditUnitView from './edit-unit-view';

const UnitListView: React.FC = observer(() => {
  const {
    fetchUnits,
    units,
    selectedUnitIds,
    setSelectedProgramIds,
    findUnitsByName,
    onSearchQueryChange,
    deleteUnits,
    isLoading,
  } = useUnit();
  const { router, getChildLinkByKey } = useNavigation();
  const [creatingUnit, setCreatingUnit] = useState(false);
  const [edittingUnitWithId, setEdittingUnitWithId] = useState<string | null>(null);

  useEffect(() => {
    fetchUnits({});
  }, []);

  const rowSelection = {
    selectedRowKeys: selectedUnitIds,
    onChange: (selectedRowKeys: React.Key[]) => {
      setSelectedProgramIds(selectedRowKeys);
    },
  };

  return (
    <>
      <AdminPageTitle title={i18next.t('units')} />

      <TextInput
        onChange={(e) => onSearchQueryChange(e.target.value)}
        icon={HiMagnifyingGlass}
        className="table-search-box"
        placeholder={i18next.t('search_units')}
        required
        type="text"
        onKeyDown={(e) => {
          e.keyCode === 13 ? findUnitsByName({ withMetaData: true }) : null;
        }}
      />
      <AdminTable
        deleteItems={deleteUnits}
        rowSelection={rowSelection}
        items={units}
        isLoading={isLoading}
        // createNewUrl={getChildLinkByKey('create', ADMIN_LINKS.units)}
        // getEditUrl={(id) => getChildLinkByKey('edit', ADMIN_LINKS.units) + `?unitId=${id}`}
        createNew={() => setCreatingUnit(true)}
        editItem={(id) => setEdittingUnitWithId(id)}
        columns={unitTableColumns}
      />
      <Modal dismissible show={creatingUnit} onClose={() => setCreatingUnit(false)} popup>
        <Modal.Header />
        <Modal.Body>
          <CreateUnitView
            onSuccessfullyDone={() => {
              fetchUnits({});
              setCreatingUnit(false);
            }}
          />
        </Modal.Body>
      </Modal>
      <Modal dismissible show={!!edittingUnitWithId} onClose={() => setEdittingUnitWithId(null)} popup>
        <Modal.Header />
        <Modal.Body>
          {edittingUnitWithId ? (
            <EditUnitView
              unitId={edittingUnitWithId}
              onSuccessfullyDone={() => {
                fetchUnits({});
                setEdittingUnitWithId(null);
              }}
            />
          ) : null}
        </Modal.Body>
      </Modal>
    </>
  );
});

export default UnitListView;
