'use client';

import useNavigation from '@hooks/useNavigation';
import { Button, Checkbox, Spinner, Table } from 'flowbite-react';
import i18next from 'i18next';
import React from 'react';
import { IoMdAddCircleOutline } from 'react-icons/io';
import { RiDeleteBin6Line } from 'react-icons/ri';
import Link from 'next/link';
import { IoFileTrayOutline } from 'react-icons/io5';
import { ColumnData, ItemTypeBase } from './types';

export function AdminTable<ItemType extends ItemTypeBase>({
  triggerDelete,
  rowSelection,
  items,
  isLoading,
  createNewUrl,
  getEditUrl,
  columns,
}: {
  triggerDelete: () => Promise<boolean | undefined>;
  rowSelection: {
    selectedRowKeys: React.Key[];
    onChange: (selectedRowKeys: React.Key[], selectedRows: ItemType[]) => void;
  };
  items: ItemType[];
  isLoading: boolean;
  createNewUrl: string;
  getEditUrl: (id: string) => string;
  columns: ColumnData<ItemType>[];
}) {
  let { router } = useNavigation();

  return (
    <>
      <Button.Group className="mb-4">
        <Button onClick={() => router.push(createNewUrl)} className={'table-action-buttons'}>
          <IoMdAddCircleOutline className="mr-3 h-4 w-4" />
          {i18next.t('new')}
        </Button>
        <Button onClick={triggerDelete} className={'table-action-buttons'}>
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
                event.target.checked
                  ? rowSelection.onChange(
                      items.map((item) => item._id),
                      items,
                    )
                  : rowSelection.onChange([], [])
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
                        ? rowSelection.onChange([...rowSelection.selectedRowKeys, item._id], [...items, item])
                        : rowSelection.onChange(
                            rowSelection.selectedRowKeys.filter((id) => id !== item._id),
                            items.filter((c) => c._id !== item._id),
                          )
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
    </>
  );
}
