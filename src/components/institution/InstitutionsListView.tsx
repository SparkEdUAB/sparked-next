'use client';

import { AdminPageTitle } from '@components/layouts';
import useInstitution, { transformRawInstitution } from '@hooks/useInstitution';
import { Modal, Button, Label, Textarea, Select } from 'flowbite-react';
import React, { useState, useMemo } from 'react';
import { institutionTableColumnsWithActions } from './index';
import { AdminTable } from '@components/admin/AdminTable/AdminTable';
import CreateInstitutionView from './CreateInstitutionView';
import EditInstitutionView from './EditInstitutionView';
import { useAdminListViewData } from '@hooks/useAdmin/useAdminListViewData';
import { API_LINKS } from 'app/links';
import { T_InstitutionFields } from '@hooks/useInstitution/types';
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
    isLoading: isProcessing
  } = useInstitution();
  const [creatingInstitution, setCreatingInstitution] = useState(false);
  const [edittingInstitution, setEdittingInstitution] = useState<T_InstitutionFields | null>(null);
  const [rejectingInstitution, setRejectingInstitution] = useState<T_InstitutionFields | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [verificationFilter, setVerificationFilter] = useState<'all' | 'verified' | 'pending'>('all');

  // Verification handlers
  const handleApprove = async (institution: T_InstitutionFields) => {
    const success = await approveInstitution(institution._id);
    if (success) {
      mutate(); // Refresh the list
    }
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
        mutate(); // Refresh the list
      }
    }
  };

  const {
    items: allInstitutions,
    isLoading,
    mutate,
    loadMore,
    hasMore,
    error,
  } = useAdminListViewData(
    API_LINKS.FETCH_INSTITUTIONS,
    'institutions',
    transformRawInstitution,
    API_LINKS.FIND_INSTITUTIONS_BY_NAME,
    searchQuery,
  );

  // Filter institutions based on verification status
  const institutions = useMemo(() => {
    if (verificationFilter === 'all') return allInstitutions;
    if (verificationFilter === 'verified') return allInstitutions.filter(inst => inst.is_verified);
    if (verificationFilter === 'pending') return allInstitutions.filter(inst => !inst.is_verified);
    return allInstitutions;
  }, [allInstitutions, verificationFilter]);

  const rowSelection = {
    selectedRowKeys: selectedInstitutionIds,
    onChange: (selectedRowKeys: React.Key[]) => {
      setSelectedInstitutionIds(selectedRowKeys);
    },
  };

  return (
    <>
      <AdminPageTitle title="Institutions" />

      <AdminTable<T_InstitutionFields>
        deleteItems={async () => {
          const result = await deleteInstitutions();
          mutate();
          return !!result;
        }}
        rowSelection={rowSelection}
        items={institutions}
        isLoading={isLoading}
        createNew={() => setCreatingInstitution(true)}
        editItem={(item) => setEdittingInstitution(item)}
        columns={institutionTableColumnsWithActions(handleApprove, handleReject, isProcessing)}
        onSearchQueryChange={onSearchQueryChange}
        hasMore={hasMore}
        loadMore={loadMore}
        error={error}
        additionalButtons={
          <div className="flex items-center space-x-2">
            <Label htmlFor="verification-filter" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Filter:
            </Label>
            <Select
              id="verification-filter"
              value={verificationFilter}
              onChange={(e) => setVerificationFilter(e.target.value as 'all' | 'verified' | 'pending')}
              className="w-32"
            >
              <option value="all">{i18next.t('all')} ({allInstitutions.length})</option>
              <option value="pending">{i18next.t('pending')} ({allInstitutions.filter(i => !i.is_verified).length})</option>
              <option value="verified">{i18next.t('verified')} ({allInstitutions.filter(i => i.is_verified).length})</option>
            </Select>
          </div>
        }
      />

      <Modal show={creatingInstitution} onClose={() => setCreatingInstitution(false)} size="2xl">
        <Modal.Header>{i18next.t('create_institution')}</Modal.Header>
        <Modal.Body>
          <CreateInstitutionView
            onSuccessfullyDone={() => {
              setCreatingInstitution(false);
              mutate();
            }}
          />
        </Modal.Body>
      </Modal>

      <Modal show={!!edittingInstitution} onClose={() => setEdittingInstitution(null)} size="2xl">
        <Modal.Header>{i18next.t('edit_institution')}</Modal.Header>
        <Modal.Body>
          {edittingInstitution && (
            <EditInstitutionView
              institution={edittingInstitution}
              onSuccessfullyDone={() => {
                setEdittingInstitution(null);
                mutate();
              }}
            />
          )}
        </Modal.Body>
      </Modal>

      {/* Reject Institution Modal */}
      <Modal show={!!rejectingInstitution} onClose={() => setRejectingInstitution(null)}>
        <Modal.Header>{i18next.t('reject_institution')}</Modal.Header>
        <Modal.Body>
          {rejectingInstitution && (
            <div className="space-y-4">
              <p className="text-gray-700 dark:text-gray-300">
                {i18next.t('reject_institution_confirm')} <span className="font-semibold">&quot;{rejectingInstitution.name}&quot;</span>?
              </p>
              
              <div>
                <Label htmlFor="rejectionReason" value={i18next.t('rejection_reason_label')} />
                <Textarea
                  id="rejectionReason"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder={i18next.t('rejection_reason_placeholder')}
                  rows={3}
                  className="mt-1"
                />
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            color="failure"
            onClick={confirmReject}
            disabled={isProcessing}
          >
            {i18next.t('reject_institution')}
          </Button>
          <Button
            color="gray"
            onClick={() => {
              setRejectingInstitution(null);
              setRejectionReason('');
            }}
          >
            {i18next.t('cancel')}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default InstitutionsListView;