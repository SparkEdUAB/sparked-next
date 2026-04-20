'use client';

import React, { useState, useMemo } from 'react';
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
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAdminListViewData } from '@hooks/useAdmin/useAdminListViewData';
import { API_LINKS } from 'app/links';
import useInstitution, { transformRawInstitution } from '@hooks/useInstitution';
import { T_InstitutionFields } from '@hooks/useInstitution/types';
import { institutionTableColumnsWithActions } from './index';
import CreateInstitutionView from './CreateInstitutionView';
import EditInstitutionView from './EditInstitutionView';
import InstitutionUsersView from './InstitutionUsersView';
import i18next from 'i18next';

const InstitutionsListView: React.FC = () => {
  const {
    selectedInstitutionIds,
    setSelectedInstitutionIds,
    onSearchQueryChange,
    deleteInstitutions,
    searchQuery,
    approveInstitution,
    rejectInstitution,
    isLoading: isProcessing,
  } = useInstitution();

  const [creatingInstitution, setCreatingInstitution] = useState(false);
  const [edittingInstitution, setEdittingInstitution] = useState<T_InstitutionFields | null>(null);
  const [rejectingInstitution, setRejectingInstitution] = useState<T_InstitutionFields | null>(
    null,
  );
  const [rejectionReason, setRejectionReason] = useState('');
  const [verificationFilter, setVerificationFilter] = useState<'all' | 'verified' | 'pending'>(
    'all',
  );
  const [viewingUsersFor, setViewingUsersFor] = useState<T_InstitutionFields | null>(null);

  const handleApprove = async (institution: T_InstitutionFields) => {
    const success = await approveInstitution(institution._id);
    if (success) mutate();
  };

  const handleReject = (institution: T_InstitutionFields) => {
    setRejectingInstitution(institution);
  };

  const confirmReject = async () => {
    if (rejectingInstitution) {
      const success = await rejectInstitution(rejectingInstitution._id, rejectionReason);
      if (success) {
        setRejectingInstitution(null);
        setRejectionReason('');
        mutate();
      }
    }
  };

  const { items: allInstitutions, isLoading, mutate, loadMore, hasMore, error } =
    useAdminListViewData(
      API_LINKS.FETCH_INSTITUTIONS,
      'institutions',
      transformRawInstitution,
      API_LINKS.FIND_INSTITUTIONS_BY_NAME,
      searchQuery,
    );

  const institutions = useMemo(() => {
    if (verificationFilter === 'verified') return allInstitutions.filter((i) => i.is_verified);
    if (verificationFilter === 'pending') return allInstitutions.filter((i) => !i.is_verified);
    return allInstitutions;
  }, [allInstitutions, verificationFilter]);

  const rowSelection = {
    selectedRowKeys: selectedInstitutionIds,
    onChange: (selectedRowKeys: React.Key[]) => setSelectedInstitutionIds(selectedRowKeys),
  };

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Institutions</h1>
        <div className="flex items-center gap-2">
          <Label htmlFor="verification-filter" className="text-sm">
            Filter:
          </Label>
          <Select
            value={verificationFilter}
            onValueChange={(v) => setVerificationFilter(v as typeof verificationFilter)}
          >
            <SelectTrigger id="verification-filter" className="w-32 h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All ({allInstitutions.length})</SelectItem>
              <SelectItem value="pending">
                Pending ({allInstitutions.filter((i) => !i.is_verified).length})
              </SelectItem>
              <SelectItem value="verified">
                Verified ({allInstitutions.filter((i) => i.is_verified).length})
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <DataTable<T_InstitutionFields>
        deleteItems={async () => {
          const r = await deleteInstitutions();
          mutate();
          return !!r;
        }}
        rowSelection={rowSelection}
        items={institutions}
        isLoading={isLoading}
        createNew={() => setCreatingInstitution(true)}
        editItem={(item) => setEdittingInstitution(item)}
        columns={institutionTableColumnsWithActions(
          handleApprove,
          handleReject,
          isProcessing,
          setViewingUsersFor,
        )}
        onSearchQueryChange={onSearchQueryChange}
        hasMore={hasMore}
        loadMore={loadMore}
        error={error}
      />

      {/* Create */}
      <FormSheet
        open={creatingInstitution}
        onClose={() => setCreatingInstitution(false)}
        title={i18next.t('create_institution')}
      >
        <CreateInstitutionView
          onSuccessfullyDone={() => {
            setCreatingInstitution(false);
            mutate();
          }}
        />
      </FormSheet>

      {/* Edit */}
      <FormSheet
        open={!!edittingInstitution}
        onClose={() => setEdittingInstitution(null)}
        title={i18next.t('edit_institution')}
      >
        {edittingInstitution && (
          <EditInstitutionView
            institution={edittingInstitution}
            onSuccessfullyDone={() => {
              setEdittingInstitution(null);
              mutate();
            }}
          />
        )}
      </FormSheet>

      {/* Reject dialog */}
      <Dialog
        open={!!rejectingInstitution}
        onOpenChange={(v) => !v && setRejectingInstitution(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{i18next.t('reject_institution')}</DialogTitle>
            <DialogDescription>
              {i18next.t('reject_institution_confirm')}{' '}
              <span className="font-semibold">&quot;{rejectingInstitution?.name}&quot;</span>?
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="rejectionReason">{i18next.t('rejection_reason_label')}</Label>
            <Textarea
              id="rejectionReason"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder={i18next.t('rejection_reason_placeholder')}
              rows={3}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setRejectingInstitution(null);
                setRejectionReason('');
              }}
            >
              {i18next.t('cancel')}
            </Button>
            <Button variant="destructive" onClick={confirmReject} disabled={isProcessing}>
              {i18next.t('reject_institution')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View users dialog */}
      <Dialog open={!!viewingUsersFor} onOpenChange={(v) => !v && setViewingUsersFor(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Users — {viewingUsersFor?.name}</DialogTitle>
          </DialogHeader>
          {viewingUsersFor && (
            <InstitutionUsersView
              institutionId={viewingUsersFor._id}
              institutionName={viewingUsersFor.name}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default InstitutionsListView;
