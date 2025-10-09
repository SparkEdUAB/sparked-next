'use client';

import { AdminTable } from '@components/admin/AdminTable/AdminTable';
import { AdminPageTitle } from '@components/layouts';
import { useAdminListViewData } from '@hooks/useAdmin/useAdminListViewData';
import { API_LINKS } from 'app/links';
import { Button, Drawer, Modal, Label, Select } from 'flowbite-react';
import i18next from 'i18next';
import React, { useState } from 'react';
import CreateUserView from './create-user-view';
import EditUserView from './edit-user-view';
import useUser, { transformRawUser } from '@hooks/useUser';
import { T_UserFields } from '@hooks/useUser/types';
import { userTableColumns } from '.';
import useAuth from '@hooks/useAuth';
import useInstitution from '@hooks/useInstitution';
import { HiUserGroup } from 'react-icons/hi';

const UsersListView = () => {
  const { selectedUserIds, setSelectedUserIds, deleteUsers, assignUsersToInstitution } = useUser();
  const [creatingUser, setCreatingUser] = useState(false);
  const [edittingUser, setEdittingUser] = useState<T_UserFields | null>(null);
  const { handleForgotPassword, loading } = useAuth();
  const [resettingPasswordFor, setResettingPasswordFor] = useState<string | null>(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedInstitutionId, setSelectedInstitutionId] = useState<string>('');
  const { publicInstitutions, fetchPublicInstitutions } = useInstitution();

  React.useEffect(() => {
    if (showAssignModal && publicInstitutions.length === 0) {
      fetchPublicInstitutions();
    }
  }, [showAssignModal, publicInstitutions.length, fetchPublicInstitutions]);

  const {
    items: users,
    isLoading,
    mutate,
    loadMore,
    hasMore,
    error,
  } = useAdminListViewData(API_LINKS.FETCH_USERS, 'users', transformRawUser, API_LINKS.FIND_USERS_BY_NAME);

  const rowSelection = {
    selectedRowKeys: selectedUserIds,
    onChange: (selectedRowKeys: React.Key[]) => {
      setSelectedUserIds(selectedRowKeys);
    },
  };

  const handleAssignToInstitution = async () => {
    if (!selectedInstitutionId) {
      return;
    }

    const success = await assignUsersToInstitution(
      selectedUserIds as string[],
      selectedInstitutionId
    );

    if (success) {
      setShowAssignModal(false);
      setSelectedInstitutionId('');
      setSelectedUserIds([]);
      mutate(); // Refresh the list
    }
  };

  return (
    <>
      <AdminPageTitle title={i18next.t('users')} />

      <AdminTable<any>
        deleteItems={async () => {
          const result = await deleteUsers();
          mutate();
          return result;
        }}
        rowSelection={rowSelection}
        items={users}
        isLoading={isLoading}
        createNew={() => setCreatingUser(true)}
        editItem={(id) => setEdittingUser(id)}
        additionalButtons={
          <Button
            color="blue"
            onClick={() => setShowAssignModal(true)}
            disabled={selectedUserIds.length === 0}
          >
            <HiUserGroup className="mr-2 h-5 w-5" />
            Assign to Institution
          </Button>
        }
        columns={userTableColumns.map((col) => {
          if (col.key === 'action') {
            return {
              ...col,
              render: (_, record) => (
                <Button
                  color="gray"
                  isProcessing={loading && resettingPasswordFor === record.email}
                  onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
                    e.stopPropagation();
                    setResettingPasswordFor(record.email);
                    handleForgotPassword(record.email, () => setResettingPasswordFor(null));
                  }}
                >
                  Reset Password
                </Button>
              ),
            };
          }
          return col;
        })}
        loadMore={loadMore}
        hasMore={hasMore}
        error={error}
      />
      <Modal dismissible show={creatingUser} onClose={() => setCreatingUser(false)} popup>
        <Modal.Header />
        <Modal.Body>
          <CreateUserView
            onSuccessfullyDone={() => {
              mutate();
              setCreatingUser(false);
            }}
          />
        </Modal.Body>
      </Modal>
      <Drawer
        className="w-[360px] sm:w-[460px] lg:w-[560px]"
        open={!!edittingUser}
        onClose={() => setEdittingUser(null)}
        position="right"
      >
        <Drawer.Header titleIcon={() => <></>} />
        <Drawer.Items>
          {edittingUser ? (
            <EditUserView
              user={edittingUser}
              onSuccessfullyDone={() => {
                mutate();
                setEdittingUser(null);
              }}
            />
          ) : null}
        </Drawer.Items>
      </Drawer>

      {/* Assign to Institution Modal */}
      <Modal show={showAssignModal} onClose={() => setShowAssignModal(false)}>
        <Modal.Header>Assign Users to Institution</Modal.Header>
        <Modal.Body>
          <div className="space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Assign {selectedUserIds.length} selected user(s) to an institution.
            </p>
            <div>
              <Label htmlFor="institution-select" value="Select Institution" />
              <Select
                id="institution-select"
                value={selectedInstitutionId}
                onChange={(e) => setSelectedInstitutionId(e.target.value)}
                required
              >
                <option value="">Choose an institution...</option>
                {publicInstitutions
                  .filter((inst) => inst.is_verified)
                  .map((institution) => (
                    <option key={institution._id} value={institution._id}>
                      {institution.name} ({institution.type})
                    </option>
                  ))}
              </Select>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleAssignToInstitution} disabled={!selectedInstitutionId}>
            Assign
          </Button>
          <Button color="gray" onClick={() => setShowAssignModal(false)}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default UsersListView;
