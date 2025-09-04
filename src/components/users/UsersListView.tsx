'use client';

import { AdminTable } from '@components/admin/AdminTable/AdminTable';
import { AdminPageTitle } from '@components/layouts';
import { useAdminListViewData } from '@hooks/useAdmin/useAdminListViewData';
import { API_LINKS } from 'app/links';
import { Button, Drawer, Modal } from 'flowbite-react';
import i18next from 'i18next';
import React, { useState } from 'react';
import CreateUserView from './create-user-view';
import EditUserView from './edit-user-view';
import useUser, { transformRawUser } from '@hooks/useUser';
import { T_UserFields } from '@hooks/useUser/types';
import { userTableColumns } from '.';
import useAuth from '@hooks/useAuth';

const UsersListView = () => {
  const { selectedUserIds, setSelectedUserIds, deleteUsers } = useUser();
  const [creatingUser, setCreatingUser] = useState(false);
  const [edittingUser, setEdittingUser] = useState<T_UserFields | null>(null);
  const { handleForgotPassword, loading } = useAuth();
  const [resettingPasswordFor, setResettingPasswordFor] = useState<string | null>(null);

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
        columns={userTableColumns.map((col) => {
          if (col.key === 'action') {
            return {
              ...col,
              render: (_, record) => (
                <Button
                  color="gray"
                  isProcessing={loading && resettingPasswordFor === record.email}
                  onClick={(e) => {
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
    </>
  );
};

export default UsersListView;
