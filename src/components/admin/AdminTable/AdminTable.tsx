'use client';

import useNavigation from '@hooks/useNavigation';
import { Checkbox, Spinner, Table } from 'flowbite-react';
import React, { useState } from 'react';
import { IoFileTrayOutline } from 'react-icons/io5';
import { T_ColumnData, T_ItemTypeBase } from './types';
import { DeletionWarningModal } from './DeletionWarningModal';
import { AdminTableButtonGroup } from './AdminTableButtonGroup';
import { MdEdit } from 'react-icons/md';

export function AdminTable<ItemType extends T_ItemTypeBase>({
  rowSelection,
  items,
  isLoading,
  // createNewUrl,
  createNew,
  // getEditUrl,
  editItem,
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
  // createNewUrl: string;
  createNew: () => void;
  // getEditUrl: (id: string) => string;
  editItem: (id: string) => void;
  columns: T_ColumnData<ItemType>[];
}) {
  const { router } = useNavigation();
  const [showDeletionWarning, setShowDeletionWarning] = useState(false);
  const toggleDeletionWarning = () => setShowDeletionWarning((value) => !value);

  return (
    <>
      <AdminTableButtonGroup
        router={router}
        // createNewUrl={createNewUrl}
        createNew={createNew}
        rowSelection={rowSelection}
        toggleDeletionWarning={toggleDeletionWarning}
      />
      <div className="w-full overflow-x-scroll rounded-lg drop-shadow-md">
        <Table>
          <Table.Head>
            <Table.HeadCell className="p-4 bg-gray-100">
              <Checkbox
                checked={rowSelection.selectedRowKeys.length === items.length && items.length !== 0}
                onChange={(event) =>
                  event.target.checked
                    ? rowSelection.onChange(items.map((item) => item._id))
                    : rowSelection.onChange([])
                }
              />
            </Table.HeadCell>
            {columns.map((column) => (
              <Table.HeadCell key={column.key} className="bg-gray-100">
                {column.title?.toString()}
              </Table.HeadCell>
            ))}
            <Table.HeadCell className="bg-gray-100"></Table.HeadCell>
          </Table.Head>

          <Table.Body className="divide-y">
            {isLoading ? (
              <AdminTableLoadingSpinner colSpan={columns.length + 2} />
            ) : items.length === 0 ? (
              <NothingToShow colSpan={columns.length + 2} />
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
                    {/* <a
                      // href={getEditUrl(item._id)}
                      onClick={() => editItem(item._id)}
                      className="font-medium text-cyan-600 dark:text-cyan-500"
                    > */}
                    <MdEdit
                      size={18}
                      onClick={() => editItem(item._id)}
                      className="cursor-pointer font-medium text-cyan-600 dark:text-cyan-500"
                    />
                    {/* </a> */}
                  </Table.Cell>
                </Table.Row>
              ))
            )}
          </Table.Body>
        </Table>
      </div>
      <DeletionWarningModal
        showDeletionWarning={showDeletionWarning}
        toggleDeletionWarning={toggleDeletionWarning}
        deleteItems={deleteItems}
        numberOfElements={rowSelection.selectedRowKeys.length}
      />
    </>
  );
}

function NothingToShow({ colSpan }: { colSpan?: number | undefined }) {
  return (
    <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
      <Table.Cell colSpan={colSpan}>
        <div className="flex flex-col items-center justify-center h-[150px] text-gray-300 dark:text-gray-700">
          <IoFileTrayOutline size={70} />
          <div className="font-semibold text-lg">Nothing to show</div>
        </div>
      </Table.Cell>
    </Table.Row>
  );
}

function AdminTableLoadingSpinner({ colSpan }: { colSpan?: number | undefined }) {
  return (
    <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
      <Table.Cell colSpan={colSpan}>
        <div className="flex items-center justify-center h-[150px]">
          <Spinner size="xl" />
        </div>
      </Table.Cell>
    </Table.Row>
  );
}
