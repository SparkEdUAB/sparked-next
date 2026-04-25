'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import React, { ReactNode, useState } from 'react';
import { IoFileTrayOutline } from 'react-icons/io5';
import { T_ColumnData, T_ItemTypeBase } from './types';
import { DeletionWarningModal } from './DeletionWarningModal';
import { AdminTableButtonGroup } from './AdminTableButtonGroup';
import useConfig from '@hooks/use-config';
import { HiMagnifyingGlass, HiXMark } from 'react-icons/hi2';
import i18next from 'i18next';
import InfiniteScroll from 'react-infinite-scroll-component';
import BouncingLoader from '@components/atom/BouncingLoader/BouncingLoader';
import { LoadingSpinner } from '@components/atom/AdminloadinSpiner';

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
  additionalButtons,
}: {
  deleteItems: () => Promise<boolean | undefined>;
  rowSelection: {
    selectedRowKeys: React.Key[];
    onChange: (selectedRowKeys: React.Key[]) => void;
  };
  items: ItemType[];
  isLoading: boolean;
  onSearchQueryChange?: (text: string) => void;
  createNew: () => void;
  editItem: (item: ItemType) => void;
  columns: T_ColumnData<ItemType>[];
  loadMore: () => void;
  hasMore: boolean;
  error: any;
  additionalButtons?: ReactNode[] | ReactNode;
}) {
  const [showDeletionWarning, setShowDeletionWarning] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const toggleDeletionWarning = () => setShowDeletionWarning((value) => !value);

  const { configs, getDisabledConfigItems } = useConfig();

  const disabledConfigItems: Array<string> = configs ? getDisabledConfigItems({ configs }) : [];

  const filteredColumns = columns.filter((i) => disabledConfigItems.indexOf(i.key) === -1);

  const handleSearch = () => {
    if (onSearchQueryChange) {
      onSearchQueryChange(searchQuery);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    if (onSearchQueryChange) {
      onSearchQueryChange('');
    }
  };

  return (
    <>
      {onSearchQueryChange && (
        <div className="relative max-w-4xl mb-4">
          <Input
            className="table-search-box pl-9"
            placeholder={i18next.t('search_items')}
            required
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSearch();
              }
            }}
          />
          <HiMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          <div className="absolute right-0 top-0 h-full flex items-center pr-2 gap-1">
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                aria-label="Clear search"
              >
                <HiXMark className="h-5 w-5 text-gray-500" />
              </button>
            )}
            <button
              onClick={handleSearch}
              className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label="Search"
            >
              <HiMagnifyingGlass className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </div>
      )}

      <AdminTableButtonGroup
        createNew={createNew}
        rowSelection={rowSelection}
        toggleDeletionWarning={toggleDeletionWarning}
        additionalButtons={additionalButtons}
      />
      <div className="w-full overflow-x-scroll rounded-lg drop-shadow-md custom-scrollbar">
        {isLoading ? (
          <LoadingSpinner />
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
              <TableHeader>
                <TableRow>
                  <TableHead className="p-4 bg-gray-100">
                    <Checkbox
                      className="cursor-pointer"
                      checked={rowSelection.selectedRowKeys.length === items?.length && items?.length !== 0}
                      onCheckedChange={(checked) =>
                        checked
                          ? rowSelection.onChange(items?.map((item) => item._id))
                          : rowSelection.onChange([])
                      }
                    />
                  </TableHead>
                  {filteredColumns.map((column, i) => (
                    <TableHead key={`${column.key}-${i}`} className="bg-gray-100">
                      {column.title?.toString()}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>

              <TableBody className="divide-y">
                {items?.map((item, index) => (
                  <TableRow
                    key={`${item._id}-${index}`}
                    className="bg-white dark:border-gray-700 dark:bg-gray-800 hover:bg-gray-50 hover:dark:bg-gray-700 active:bg-gray-100 active:dark:bg-gray-600 cursor-pointer"
                    onClick={() => editItem(item)}
                  >
                    <TableCell className="p-4">
                      <Checkbox
                        className="cursor-pointer"
                        onClick={(e) => e.stopPropagation()}
                        checked={rowSelection.selectedRowKeys.includes(item._id)}
                        onCheckedChange={(checked) =>
                          checked
                            ? rowSelection.onChange([...rowSelection.selectedRowKeys, item._id])
                            : rowSelection.onChange(rowSelection.selectedRowKeys.filter((id) => id !== item._id))
                        }
                      />
                    </TableCell>
                    {filteredColumns.map((column, index) => {
                      const text = item[column.dataIndex as keyof ItemType] as string;
                      return (
                        <TableCell key={`${column.title}-${index}`}>
                          {column.render ? column.render(text, item) : text}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>
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
