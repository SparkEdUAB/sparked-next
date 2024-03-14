'use client';

import { AdminPageTitle } from '@components/layouts';
import { ADMIN_LINKS } from '@components/layouts/adminLayout/links';
import useNavigation from '@hooks/useNavigation';
import useProgram from '@hooks/useProgram';
import { Modal, TextInput } from 'flowbite-react';
import i18next from 'i18next';
import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import { HiMagnifyingGlass } from 'react-icons/hi2';
import { programTableColumns } from '.';
import { AdminTable } from '@components/admin/AdminTable/AdminTable';
import CreateProgramView from './createProgramView';
import EditProgramView from './editProgramView';

const ProgramsListView: React.FC = observer(() => {
  const {
    fetchPrograms,
    programs,
    selectedProgramIds,
    setSelectedProgramIds,
    findProgramsByName,
    onSearchQueryChange,
    deletePrograms,
    isLoading,
  } = useProgram();
  const { getChildLinkByKey } = useNavigation();
  const [creatingProgram, setCreatingProgram] = useState(false);
  const [edittingProgramWithId, setEdittingProgramWithId] = useState<string | null>(null);

  useEffect(() => {
    fetchPrograms({});
  }, []);

  const rowSelection = {
    selectedRowKeys: selectedProgramIds,
    onChange: (selectedRowKeys: React.Key[]) => {
      setSelectedProgramIds(selectedRowKeys);
    },
  };

  return (
    <>
      <AdminPageTitle title={i18next.t('programs')} />

      <TextInput
        onChange={(e) => onSearchQueryChange(e.target.value)}
        icon={HiMagnifyingGlass}
        className="table-search-box"
        placeholder={i18next.t('search_programs')}
        required
        type="text"
        onKeyDown={(e) => {
          e.keyCode === 13 ? findProgramsByName({ withMetaData: true }) : null;
        }}
      />
      <AdminTable
        deleteItems={deletePrograms}
        rowSelection={rowSelection}
        items={programs}
        isLoading={isLoading}
        // createNewUrl={getChildLinkByKey('create', ADMIN_LINKS.programs)}
        // getEditUrl={(id) => getChildLinkByKey('edit', ADMIN_LINKS.programs) + `?programId=${id}`}
        createNew={() => setCreatingProgram(true)}
        editItem={(id) => setEdittingProgramWithId(id)}
        columns={programTableColumns}
      />
      <Modal dismissible show={creatingProgram} onClose={() => setCreatingProgram(false)} popup>
        <Modal.Header />
        <Modal.Body>
          <CreateProgramView
            onSuccessfullyDone={() => {
              fetchPrograms({});
              setCreatingProgram(false);
            }}
          />
        </Modal.Body>
      </Modal>
      <Modal dismissible show={!!edittingProgramWithId} onClose={() => setEdittingProgramWithId(null)} popup>
        <Modal.Header />
        <Modal.Body>
          {edittingProgramWithId ? (
            <EditProgramView
              programId={edittingProgramWithId}
              onSuccessfullyDone={() => {
                fetchPrograms({});
                setEdittingProgramWithId(null);
              }}
            />
          ) : null}
        </Modal.Body>
      </Modal>
    </>
  );
});

export default ProgramsListView;
