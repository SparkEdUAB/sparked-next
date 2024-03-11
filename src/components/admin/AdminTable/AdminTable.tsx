'use client';

import useNavigation from '@hooks/useNavigation';
import { Button, Checkbox, Modal, Spinner, Table } from 'flowbite-react';
import i18next from 'i18next';
import React, { useState } from 'react';
import { IoMdAddCircleOutline } from 'react-icons/io';
import { RiDeleteBin6Line } from 'react-icons/ri';
import Link from 'next/link';
import { IoFileTrayOutline } from 'react-icons/io5';
import { ColumnData, ItemTypeBase } from './types';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { message } from 'antd';

export function AdminTable<ItemType extends ItemTypeBase>({
  rowSelection,
  items,
  isLoading,
  createNewUrl,
  getEditUrl,
  columns,
  deleteItems,
}: {
  deleteItems: () => Promise<boolean | undefined>;
  rowSelection: {
    selectedRowKeys: React.Key[];
    onChange: (selectedRowKeys: React.Key[]) => void;
  };
  items: ItemType[];
  isLoading: boolean;
  createNewUrl: string;
  getEditUrl: (id: string) => string;
  columns: ColumnData<ItemType>[];
}) {
  const { router } = useNavigation();
  const [showDeletionWarning, setShowDeletionWarning] = useState(false);
  const toggleDeletionWarning = () => setShowDeletionWarning((value) => !value);

  return (
    <>
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
      <Table>
        <Table.Head>
          <Table.HeadCell className="p-4">
            <Checkbox
              checked={rowSelection.selectedRowKeys.length === items.length && items.length !== 0}
              onChange={(event) =>
                event.target.checked ? rowSelection.onChange(items.map((item) => item._id)) : rowSelection.onChange([])
              }
            />
          </Table.HeadCell>
          {columns.map((column) => (
            <Table.HeadCell key={column.key}>{column.title?.toString()}</Table.HeadCell>
          ))}
          <Table.HeadCell></Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
          {isLoading ? (
            <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
              <Table.Cell colSpan={columns.length + 2}>
                <div className="flex items-center justify-center h-[150px]">
                  <Spinner size="xl" />
                </div>
              </Table.Cell>
            </Table.Row>
          ) : items.length === 0 ? (
            <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
              <Table.Cell colSpan={columns.length + 2}>
                <div className="flex flex-col items-center justify-center h-[150px] text-gray-300 dark:text-gray-700">
                  <IoFileTrayOutline size={70} />
                  <div className="font-semibold text-lg">Nothing to show</div>
                </div>
              </Table.Cell>
            </Table.Row>
          ) : (
            items.map((item) => (
              <Table.Row key={item.key} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                <Table.Cell className="p-4">
                  <Checkbox
                    checked={rowSelection.selectedRowKeys.includes(item._id)}
                    onChange={(event) =>
                      event.target.checked
                        ? rowSelection.onChange([...rowSelection.selectedRowKeys, item._id])
                        : rowSelection.onChange(rowSelection.selectedRowKeys.filter((id) => id !== item._id))
                    }
                  />
                </Table.Cell>
                {columns.map((column) => {
                  const text = item[column.dataIndex as keyof ItemType] as string;
                  return <Table.Cell key={column.key}>{column.render ? column.render(text, item) : text}</Table.Cell>;
                })}
                <Table.Cell>
                  <Link
                    href={getEditUrl(item._id)}
                    className="font-medium text-cyan-600 hover:underline dark:text-cyan-500"
                  >
                    Edit
                  </Link>
                </Table.Cell>
              </Table.Row>
            ))
          )}
        </Table.Body>
      </Table>
      <DeletionWarningModal
        showDeletionWarning={showDeletionWarning}
        toggleDeletionWarning={toggleDeletionWarning}
        deleteItems={deleteItems}
        numberOfElements={rowSelection.selectedRowKeys.length}
      />
    </>
  );
}

function DeletionWarningModal({
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
