'use client';
import { Button } from 'flowbite-react';
import i18next from 'i18next';
import React from 'react';
import { IoMdAddCircleOutline } from 'react-icons/io';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { message } from 'antd';
import { useRouter } from 'next-nprogress-bar';

export function AdminTableButtonGroup({
  router,
  createNewUrl,
  rowSelection,
  toggleDeletionWarning,
}: {
  router: ReturnType<typeof useRouter>;
  createNewUrl: string;
  rowSelection: { selectedRowKeys: React.Key[]; onChange: (selectedRowKeys: React.Key[]) => void };
  toggleDeletionWarning: () => void;
}) {
  return (
    <Button.Group className="mb-5">
      <Button onClick={() => router.push(createNewUrl)} className={'table-action-buttons'}>
        <IoMdAddCircleOutline className="mr-3 h-4 w-4" />
        {i18next.t('new')}
      </Button>
      <Button
        onClick={() =>
          rowSelection.selectedRowKeys.length === 0
            ? message.warning(i18next.t('select_items'))
            : toggleDeletionWarning()
        }
        className={'table-action-buttons'}
      >
        <RiDeleteBin6Line className="mr-3 h-4 w-4" />
        {i18next.t('delete')}
      </Button>
    </Button.Group>
  );
}
