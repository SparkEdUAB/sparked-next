'use client';

import { useState, useEffect } from 'react';
import { Button, Modal, Select, Label, Alert } from 'flowbite-react';
import { API_LINKS } from 'app/links';
import { useToastMessage } from 'providers/ToastMessageContext';
import { T_InstitutionFields } from '@hooks/useInstitution/types';
import useInstitution from '@hooks/useInstitution';
import { HiOutlineAcademicCap } from 'react-icons/hi';

interface BulkAssignContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedContentIds: string[];
  onSuccess: () => void;
}

export default function BulkAssignContentModal({
  isOpen,
  onClose,
  selectedContentIds,
  onSuccess,
}: BulkAssignContentModalProps) {
  const [selectedInstitution, setSelectedInstitution] = useState<string>('');
  const [isAssigning, setIsAssigning] = useState(false);
  const [error, setError] = useState<string>('');
  
  const { institutions, fetchInstitutions } = useInstitution();
  const message = useToastMessage();

  useEffect(() => {
    if (isOpen) {
      fetchInstitutions({ limit: 100, skip: 0 });
      setError('');
      setSelectedInstitution('');
    }
  }, [isOpen, fetchInstitutions]);

  const handleAssign = async () => {
    if (!selectedInstitution) {
      setError('Please select an institution');
      return;
    }

    try {
      setIsAssigning(true);
      setError('');

      const response = await fetch(API_LINKS.BULK_ASSIGN_CONTENT_TO_INSTITUTION, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contentIds: selectedContentIds,
          institutionId: selectedInstitution,
        }),
      });

      const data = await response.json();

      if (data.isError) {
        throw new Error(data.message || 'Failed to assign content');
      }

      message.success(`Successfully assigned ${data.modifiedCount} content items to institution`);
      onSuccess();
      onClose();
    } catch (error: any) {
      setError(error.message || 'Failed to assign content to institution');
      message.error(error.message || 'Failed to assign content to institution');
    } finally {
      setIsAssigning(false);
    }
  };

  const handleRemove = async () => {
    try {
      setIsAssigning(true);
      setError('');

      const response = await fetch(API_LINKS.REMOVE_CONTENT_FROM_INSTITUTION, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contentIds: selectedContentIds,
        }),
      });

      const data = await response.json();

      if (data.isError) {
        throw new Error(data.message || 'Failed to remove content');
      }

      message.success(`Successfully removed ${data.modifiedCount} content items from institution`);
      onSuccess();
      onClose();
    } catch (error: any) {
      setError(error.message || 'Failed to remove content from institution');
      message.error(error.message || 'Failed to remove content from institution');
    } finally {
      setIsAssigning(false);
    }
  };

  return (
    <Modal show={isOpen} onClose={onClose} size="md">
      <Modal.Header className="border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <HiOutlineAcademicCap className="w-6 h-6 text-blue-600" />
          <span>Manage Content Institution Assignment</span>
        </div>
      </Modal.Header>
      
      <Modal.Body className="space-y-6">
        {error && (
          <Alert color="failure" className="mb-4">
            {error}
          </Alert>
        )}

        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Selected {selectedContentIds.length} content item{selectedContentIds.length !== 1 ? 's' : ''}
            </p>
          </div>

          <div>
            <Label htmlFor="institution" value="Assign to Institution" className="mb-2 block" />
            <Select
              id="institution"
              value={selectedInstitution}
              onChange={(e) => setSelectedInstitution(e.target.value)}
              disabled={isAssigning}
              className="w-full"
            >
              <option value="">Select an institution...</option>
              {institutions.map((institution: T_InstitutionFields) => (
                <option key={institution._id} value={institution._id}>
                  {institution.name} ({institution.type})
                </option>
              ))}
            </Select>
          </div>

          <div className="flex flex-col space-y-2 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button
              onClick={handleAssign}
              disabled={isAssigning || !selectedInstitution}
              color="blue"
              className="w-full"
            >
              {isAssigning ? 'Assigning...' : 'Assign to Institution'}
            </Button>
            
            <Button
              onClick={handleRemove}
              disabled={isAssigning}
              color="failure"
              outline
              className="w-full"
            >
              {isAssigning ? 'Removing...' : 'Remove Institution Assignment'}
            </Button>
          </div>
        </div>
      </Modal.Body>

      <Modal.Footer className="border-t border-gray-200 dark:border-gray-700">
        <Button color="gray" onClick={onClose} disabled={isAssigning}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
}