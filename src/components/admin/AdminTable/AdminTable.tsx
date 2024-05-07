'use client';

import useNavigation from '@hooks/useNavigation';
import { Checkbox, Spinner, Table, TextInput } from 'flowbite-react';
import React, { useState } from 'react';
import { IoFileTrayOutline } from 'react-icons/io5';
import { T_ColumnData, T_ItemTypeBase } from './types';
import { DeletionWarningModal } from './DeletionWarningModal';
import { AdminTableButtonGroup } from './AdminTableButtonGroup';
import { MdEdit } from 'react-icons/md';
import useConfig from '@hooks/use-config';
import { HiMagnifyingGlass } from 'react-icons/hi2';
import i18next from 'i18next';

export function AdminTable<ItemType extends T_ItemTypeBase>({
  rowSelection,
  items,
  isLoading,
  onSearchQueryChange,
  createNew,
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
  onSearchQueryChange: (text: string) => void;
  createNew: () => void;
  editItem: (id: string) => void;
  columns: T_ColumnData<ItemType>[];
}) {
  const { router } = useNavigation();
  const [showDeletionWarning, setShowDeletionWarning] = useState(false);
  const toggleDeletionWarning = () => setShowDeletionWarning((value) => !value);

  const { configs, getDisabledConfigItems } = useConfig({ isAutoLoadCoreConfig: true });

  const disabledConfigItems: Array<string> = configs ? getDisabledConfigItems({ configs }) : [];

  const filteredColumns = columns.filter((i) => disabledConfigItems.indexOf(i.key) === -1);

  return (
    <>
      <TextInput
        onChange={(e) => onSearchQueryChange(e.target.value)}
        icon={HiMagnifyingGlass}
        className="table-search-box"
        placeholder={i18next.t('search_units')}
        required
        type="text"
        onKeyDown={(e) => {
          e.keyCode === 13 || e.currentTarget.value.trim() === '' ? onSearchQueryChange(e.currentTarget.value) : null;
        }}
      />
      <AdminTableButtonGroup
        router={router}
        createNew={createNew}
        rowSelection={rowSelection}
        toggleDeletionWarning={toggleDeletionWarning}
      />
      <div className="w-full overflow-x-scroll rounded-lg drop-shadow-md custom-scrollbar">
        <Table>
          <Table.Head>
            <Table.HeadCell className="p-4 bg-gray-100">
              <Checkbox
                checked={rowSelection.selectedRowKeys.length === items?.length && items?.length !== 0}
                onChange={(event) =>
                  event.target.checked
                    ? rowSelection.onChange(items?.map((item) => item._id))
                    : rowSelection.onChange([])
                }
              />
            </Table.HeadCell>
            {filteredColumns.map((column) => (
              <Table.HeadCell key={column.key} className="bg-gray-100">
                {column.title?.toString()}
              </Table.HeadCell>
            ))}
            <Table.HeadCell className="bg-gray-100"></Table.HeadCell>
          </Table.Head>

          <Table.Body className="divide-y">
            {isLoading ? (
              <AdminTableLoadingSpinner colSpan={filteredColumns.length + 2} />
            ) : items?.length === 0 ? (
              <NothingToShow colSpan={filteredColumns.length + 2} />
            ) : (
              items?.map((item) => (
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
                  {filteredColumns.map((column) => {
                    const text = item[column.dataIndex as keyof ItemType] as string;
                    return <Table.Cell key={column.key}>{column.render ? column.render(text, item) : text}</Table.Cell>;
                  })}
                  <Table.Cell>
                    <MdEdit
                      size={18}
                      onClick={() => editItem(item._id)}
                      className="cursor-pointer font-medium text-cyan-600 dark:text-cyan-500"
                    />
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
