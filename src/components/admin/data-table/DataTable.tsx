'use client';
import React, { ReactNode, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Pencil, Plus, Search, Trash2, X } from 'lucide-react';
import { DeletionWarningModal } from '@components/admin/AdminTable/DeletionWarningModal';
import { T_ColumnData, T_ItemTypeBase } from '@components/admin/AdminTable/types';
import useConfig from '@hooks/use-config';
import i18next from 'i18next';
import { DataTableEmptyState } from './DataTableEmptyState';
import { DataTableLoadMore } from './DataTableLoadMore';
import { DataTableSkeleton } from './DataTableSkeleton';

export function DataTable<ItemType extends T_ItemTypeBase>({
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
  additionalButtons?: ReactNode | ReactNode[];
}) {
  const [showDeletionWarning, setShowDeletionWarning] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const { configs, getDisabledConfigItems } = useConfig();
  const disabledConfigItems: string[] = configs ? getDisabledConfigItems({ configs }) : [];
  const filteredColumns = columns.filter((c) => !disabledConfigItems.includes(c.key));

  const allSelected =
    items.length > 0 && rowSelection.selectedRowKeys.length === items.length;
  const someSelected = rowSelection.selectedRowKeys.length > 0;

  const handleSearch = () => onSearchQueryChange?.(searchQuery);
  const clearSearch = () => {
    setSearchQuery('');
    onSearchQueryChange?.('');
  };

  const handleDeleteRow = (item: ItemType) => {
    rowSelection.onChange([item._id]);
    setShowDeletionWarning(true);
  };

  return (
    <TooltipProvider>
      {/* Toolbar */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <Button onClick={createNew} size="sm" className="gap-1.5">
            <Plus className="h-4 w-4" />
            {i18next.t('new')}
          </Button>
          {someSelected && (
            <Button
              variant="destructive"
              size="sm"
              className="gap-1.5"
              onClick={() => setShowDeletionWarning(true)}
            >
              <Trash2 className="h-4 w-4" />
              {i18next.t('delete')} ({rowSelection.selectedRowKeys.length})
            </Button>
          )}
          {additionalButtons}
        </div>

        {onSearchQueryChange && (
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="h-9 pl-9 pr-8"
              placeholder={i18next.t('search_items')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg border border-border">
        {isLoading ? (
          <DataTableSkeleton columnCount={filteredColumns.length + 2} rowCount={5} />
        ) : items.length === 0 ? (
          <DataTableEmptyState onCreateNew={createNew} />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-10">
                    <Checkbox
                      checked={allSelected}
                      onCheckedChange={(checked) =>
                        rowSelection.onChange(
                          checked ? items.map((i) => i._id) : [],
                        )
                      }
                    />
                  </TableHead>
                  {filteredColumns.map((col, i) => (
                    <TableHead key={`${col.key}-${i}`}>{col.title}</TableHead>
                  ))}
                  <TableHead className="w-20 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item, rowIdx) => (
                  <TableRow
                    key={`${item._id}-${rowIdx}`}
                    className="cursor-pointer hover:bg-muted/30"
                    onClick={() => editItem(item)}
                  >
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        checked={rowSelection.selectedRowKeys.includes(item._id)}
                        onCheckedChange={(checked) =>
                          rowSelection.onChange(
                            checked
                              ? [...rowSelection.selectedRowKeys, item._id]
                              : rowSelection.selectedRowKeys.filter(
                                  (id) => id !== item._id,
                                ),
                          )
                        }
                      />
                    </TableCell>
                    {filteredColumns.map((col, colIdx) => {
                      const text = item[col.dataIndex as keyof ItemType] as string;
                      return (
                        <TableCell key={`${col.key}-${colIdx}`}>
                          {col.render ? col.render(text, item) : text}
                        </TableCell>
                      );
                    })}
                    <TableCell
                      className="text-right"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-end gap-1">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => editItem(item)}
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Edit</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 hover:text-destructive"
                              onClick={() => handleDeleteRow(item)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Delete</TooltipContent>
                        </Tooltip>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {!isLoading && hasMore && (
        <DataTableLoadMore loadMore={loadMore} error={error} />
      )}

      <DeletionWarningModal
        showDeletionWarning={showDeletionWarning}
        toggleDeletionWarning={() => setShowDeletionWarning(false)}
        deleteItems={async () => {
          const result = await deleteItems();
          setShowDeletionWarning(false);
          rowSelection.onChange([]);
          return result;
        }}
        numberOfElements={rowSelection.selectedRowKeys.length}
      />
    </TooltipProvider>
  );
}
