'use client';
import { Button, Modal } from 'flowbite-react';
import i18next from 'i18next';
import React from 'react';
import { HiOutlineExclamationCircle } from 'react-icons/hi';

export function DeletionWarningModal({
  showDeletionWarning,
  toggleDeletionWarning,
  numberOfElements,
  deleteItems,
}: {
  showDeletionWarning: boolean;
  toggleDeletionWarning: () => void;
  numberOfElements: number;
  deleteItems: () => Promise<boolean | undefined>;
}) {
  return (
    <Modal show={showDeletionWarning} size="md" onClose={toggleDeletionWarning} popup>
      <Modal.Header />
      <Modal.Body>
        <div className="text-center">
          <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
          <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
            {i18next.t(numberOfElements === 1 ? 'deletion_confirmation_singular' : 'deletion_confirmation_plural')}
          </h3>
          <div className="flex justify-center gap-4">
            <Button
              color="failure"
              onClick={() => {
                toggleDeletionWarning();
                deleteItems();
              }}
            >
              {i18next.t('yes_im_sure')}
            </Button>
            <Button color="gray" onClick={toggleDeletionWarning}>
              {i18next.t('no_cancel')}
            </Button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}
