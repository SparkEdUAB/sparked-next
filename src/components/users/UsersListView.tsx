'use client';

import React, { useState } from 'react';
import { DataTable } from '@components/admin/data-table/DataTable';
import { FormSheet } from '@components/admin/form/FormSheet';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useAdminListViewData } from '@hooks/useAdmin/useAdminListViewData';
import { API_LINKS } from 'app/links';
import useUser, { transformRawUser } from '@hooks/useUser';
import { T_UserFields } from '@hooks/useUser/types';
import { userTableColumns } from '.';
import CreateUserView from './create-user-view';
import EditUserView from './edit-user-view';
import useAuth from '@hooks/useAuth';
import useInstitution from '@hooks/useInstitution';
import { HiUserGroup } from 'react-icons/hi';
import i18next from 'i18next';

const UsersListView = () => {
  const { selectedUserIds, setSelectedUserIds, deleteUsers, assignUsersToInstitution } = useUser();
  const [creatingUser, setCreatingUser] = useState(false);
  const [edittingUser, setEdittingUser] = useState<T_UserFields | null>(null);
  const { handleForgotPassword, loading } = useAuth();
  const [resettingPasswordFor, setResettingPasswordFor] = useState<string | null>(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedInstitutionId, setSelectedInstitutionId] = useState('');
  const { publicInstitutions, fetchPublicInstitutions } = useInstitution();

  React.useEffect(() => {
    if (showAssignModal && publicInstitutions.length === 0) fetchPublicInstitutions();
  }, [showAssignModal, publicInstitutions.length, fetchPublicInstitutions]);

  const { items: users, isLoading, mutate, loadMore, hasMore, error } = useAdminListViewData(
    API_LINKS.FETCH_USERS,
    'users',
    transformRawUser,
    API_LINKS.FIND_USERS_BY_NAME,
  );

  const rowSelection = {
    selectedRowKeys: selectedUserIds,
    onChange: (selectedRowKeys: React.Key[]) => setSelectedUserIds(selectedRowKeys),
  };

  const handleAssignToInstitution = async () => {
    if (!selectedInstitutionId) return;
    const success = await assignUsersToInstitution(selectedUserIds as string[], selectedInstitutionId);
    if (success) {
      setShowAssignModal(false);
      setSelectedInstitutionId('');
      setSelectedUserIds([]);
      mutate();
    }
  };

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">{i18next.t('users')}</h1>
      </div>

      <DataTable<any>
        deleteItems={async () => { const r = await deleteUsers(); mutate(); return r; }}
        rowSelection={rowSelection}
        items={users}
        isLoading={isLoading}
        createNew={() => setCreatingUser(true)}
        editItem={(id) => setEdittingUser(id)}
        additionalButtons={
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={() => setShowAssignModal(true)}
            disabled={selectedUserIds.length === 0}
          >
            <HiUserGroup className="h-4 w-4" />
            Assign to Institution
          </Button>
        }
        columns={userTableColumns.map((col) => {
          if (col.key === 'action') {
            return {
              ...col,
              render: (_: any, record: any) => (
                <Button
                  variant="outline"
                  size="sm"
                  disabled={loading && resettingPasswordFor === record.email}
                  onClick={(e: React.MouseEvent) => {
                    e.stopPropagation();
                    setResettingPasswordFor(record.email);
                    handleForgotPassword(record.email, () => setResettingPasswordFor(null));
                  }}
                >
                  {loading && resettingPasswordFor === record.email ? 'Sending...' : 'Reset Password'}
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

      <FormSheet open={creatingUser} onClose={() => setCreatingUser(false)} title="Create User">
        <CreateUserView
          onSuccessfullyDone={() => { mutate(); setCreatingUser(false); }}
        />
      </FormSheet>

      <FormSheet
        open={!!edittingUser}
        onClose={() => setEdittingUser(null)}
        title="Edit User"
      >
        {edittingUser && (
          <EditUserView
            user={edittingUser}
            onSuccessfullyDone={() => { mutate(); setEdittingUser(null); }}
          />
        )}
      </FormSheet>

      {/* Assign to Institution */}
      <Dialog open={showAssignModal} onOpenChange={(v) => !v && setShowAssignModal(false)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Users to Institution</DialogTitle>
            <DialogDescription>
              Assign {selectedUserIds.length} selected user(s) to an institution.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="institution-select">Select Institution</Label>
            <Select value={selectedInstitutionId} onValueChange={setSelectedInstitutionId}>
              <SelectTrigger id="institution-select">
                <SelectValue placeholder="Choose an institution..." />
              </SelectTrigger>
              <SelectContent>
                {publicInstitutions
                  .filter((inst) => inst.is_verified)
                  .map((institution) => (
                    <SelectItem key={institution._id} value={institution._id}>
                      {institution.name} ({institution.type})
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAssignModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleAssignToInstitution} disabled={!selectedInstitutionId}>
              Assign
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UsersListView;
