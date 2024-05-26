'use client';

import { Checkbox, Spinner, Table, TextInput } from 'flowbite-react';
import React, { useState } from 'react';
import { IoFileTrayOutline } from 'react-icons/io5';
import { T_ColumnData, T_ItemTypeBase } from './types';
import { DeletionWarningModal } from './DeletionWarningModal';
import { AdminTableButtonGroup } from './AdminTableButtonGroup';
import useConfig from '@hooks/use-config';
import { HiMagnifyingGlass } from 'react-icons/hi2';
import i18next from 'i18next';
import InfiniteScroll from 'react-infinite-scroll-component';
import BouncingLoader from '@components/atom/BouncingLoader/BouncingLoader';

export function AdminTable<ItemType extends T_ItemTypeBase>({
  rowSelection,
  items,
  isLoading,
  onSearchQueryChange,
  createNew,
  editItem,
  columns,
  deleteItems,
  loadMore,
  hasMore,
  error,
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
  editItem: (item: ItemType) => void;
  columns: T_ColumnData<ItemType>[];
  loadMore: () => void;
  hasMore: boolean;
  error: any;
}) {
  const [showDeletionWarning, setShowDeletionWarning] = useState(false);
  const toggleDeletionWarning = () => setShowDeletionWarning((value) => !value);

  const { configs, getDisabledConfigItems } = useConfig({ isAutoLoadCoreConfig: true });

  const disabledConfigItems: Array<string> = configs ? getDisabledConfigItems({ configs }) : [];

  const filteredColumns = columns.filter((i) => disabledConfigItems.indexOf(i.key) === -1);

  return (
    <>
      <TextInput
        icon={HiMagnifyingGlass}
        className="table-search-box"
        placeholder={i18next.t('search_items')}
        required
        type="text"
        onKeyDown={(e) => {
          e.keyCode === 13 || (e.target as HTMLInputElement).value.trim() === ''
            ? onSearchQueryChange((e.target as HTMLInputElement).value)
            : null;
        }}
      />
      <AdminTableButtonGroup
        createNew={createNew}
        rowSelection={rowSelection}
        toggleDeletionWarning={toggleDeletionWarning}
      />
      <div className="w-full overflow-x-scroll rounded-lg drop-shadow-md custom-scrollbar">
        {isLoading ? (
          <AdminTableLoadingSpinner />
        ) : items?.length === 0 ? (
          <NothingToShow />
        ) : (
          <InfiniteScroll
            dataLength={items.length}
            next={loadMore}
            hasMore={hasMore}
            loader={hasMore ? <InfiniteListLoader /> : null}
            scrollableTarget="scrollableDiv"
            endMessage={
              error && (
                <p className="text-center my-4">
                  <b className="text-red-500">Failed to load additional elements ({error.toString()})</b>
                </p>
              )
            }
          >
            <Table className="min-w-full">
              <Table.Head>
                <Table.HeadCell className="p-4 bg-gray-100">
                  <Checkbox
                    className="cursor-pointer"
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
              </Table.Head>

              <Table.Body className="divide-y">
                {items?.map((item) => (
                  <Table.Row
                    key={item.key}
                    className="bg-white dark:border-gray-700 dark:bg-gray-800 hover:bg-gray-50 hover:dark:bg-gray-700 active:bg-gray-100 active:dark:bg-gray-600 cursor-pointer"
                    onClick={() => editItem(item)}
                  >
                    <Table.Cell className="p-4">
                      <Checkbox
                        className="cursor-pointer"
                        onClick={(e) => e.stopPropagation()}
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
                      return (
                        <Table.Cell key={column.key}>{column.render ? column.render(text, item) : text}</Table.Cell>
                      );
                    })}
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </InfiniteScroll>
        )}
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

function NothingToShow() {
  return (
    <div className="flex flex-col items-center justify-center h-[200px] text-gray-300 dark:text-gray-700">
      <IoFileTrayOutline size={70} />
      <div className="font-semibold text-lg">Nothing to show</div>
    </div>
  );
}

function InfiniteListLoader() {
  return (
    <div className="flex flex-row justify-center items-center my-4">
      <BouncingLoader />
    </div>
  );
}

function AdminTableLoadingSpinner() {
  return (
    <div className="flex items-center justify-center h-[200px]">
      <Spinner size="xl" />
    </div>
  );
}
