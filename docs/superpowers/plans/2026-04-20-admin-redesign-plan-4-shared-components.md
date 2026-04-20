# Admin Redesign — Plan 4: Shared Components

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the shared admin UI components — DataTable (replaces AdminTable), DeletionWarningDialog (replaces Flowbite Modal), and form primitives (FormInput, FormTextarea, FormSelect, FormSheet).

**Architecture:** New directories `src/components/admin/data-table/` and `src/components/admin/form/`. `DeletionWarningModal.tsx` is updated in-place so existing imports keep working. Old `AdminFormInput/Textarea/Selector` stay in place — callers are updated in Plan 5.

**Tech Stack:** shadcn/ui (Table, Dialog, Sheet, Input, Textarea, Select, Skeleton, Checkbox, Tooltip, Button, Label), react-icons, lucide-react

**Prerequisite:** Plan 1 complete.

---

### Task 1: DataTableSkeleton + DataTableEmptyState + DataTableLoadMore

**Files:**
- Create: `src/components/admin/data-table/DataTableSkeleton.tsx`
- Create: `src/components/admin/data-table/DataTableEmptyState.tsx`
- Create: `src/components/admin/data-table/DataTableLoadMore.tsx`
- Create: `src/components/admin/data-table/DataTableSkeleton.test.tsx`
- Create: `src/components/admin/data-table/DataTableEmptyState.test.tsx`

- [ ] **Step 1: Write the failing tests**

Create `src/components/admin/data-table/DataTableSkeleton.test.tsx`:

```tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DataTableSkeleton } from './DataTableSkeleton';

vi.mock('@/components/ui/skeleton', () => ({
  Skeleton: ({ className }: any) => <div data-testid="skeleton" className={className} />,
}));
vi.mock('@/components/ui/table', () => ({
  Table: ({ children }: any) => <table>{children}</table>,
  TableHeader: ({ children }: any) => <thead>{children}</thead>,
  TableBody: ({ children }: any) => <tbody>{children}</tbody>,
  TableRow: ({ children }: any) => <tr>{children}</tr>,
  TableHead: ({ children }: any) => <th>{children}</th>,
  TableCell: ({ children }: any) => <td>{children}</td>,
}));

describe('DataTableSkeleton', () => {
  it('renders correct number of skeleton cells', () => {
    render(<DataTableSkeleton columnCount={3} rowCount={2} />);
    // 3 header + (3 * 2) body = 9 skeletons
    expect(screen.getAllByTestId('skeleton')).toHaveLength(9);
  });

  it('uses default rowCount=5 and columnCount=4', () => {
    render(<DataTableSkeleton />);
    // 4 header + (4 * 5) body = 24 skeletons
    expect(screen.getAllByTestId('skeleton')).toHaveLength(24);
  });
});
```

Create `src/components/admin/data-table/DataTableEmptyState.test.tsx`:

```tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DataTableEmptyState } from './DataTableEmptyState';

vi.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick }: any) => <button onClick={onClick}>{children}</button>,
}));

describe('DataTableEmptyState', () => {
  it('renders empty state message', () => {
    render(<DataTableEmptyState onCreateNew={vi.fn()} />);
    expect(screen.getByText('No items yet')).toBeInTheDocument();
  });

  it('calls onCreateNew when create button is clicked', () => {
    const onCreateNew = vi.fn();
    render(<DataTableEmptyState onCreateNew={onCreateNew} />);
    fireEvent.click(screen.getByRole('button'));
    expect(onCreateNew).toHaveBeenCalled();
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npm run test -- "DataTableSkeleton|DataTableEmptyState" 2>&1 | tail -10
```

Expected: FAIL — modules not found.

- [ ] **Step 3: Create the components**

Create `src/components/admin/data-table/DataTableSkeleton.tsx`:

```tsx
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';

export function DataTableSkeleton({
  columnCount = 4,
  rowCount = 5,
}: {
  columnCount?: number;
  rowCount?: number;
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-muted/50">
          {Array.from({ length: columnCount }).map((_, i) => (
            <TableHead key={i}>
              <Skeleton className="h-4 w-20" />
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: rowCount }).map((_, rowIdx) => (
          <TableRow key={rowIdx}>
            {Array.from({ length: columnCount }).map((_, colIdx) => (
              <TableCell key={colIdx}>
                <Skeleton className="h-4 w-full" />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
```

Create `src/components/admin/data-table/DataTableEmptyState.tsx`:

```tsx
import { Button } from '@/components/ui/button';
import { IoFileTrayOutline } from 'react-icons/io5';
import { Plus } from 'lucide-react';
import i18next from 'i18next';

export function DataTableEmptyState({ onCreateNew }: { onCreateNew: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-16 text-center">
      <IoFileTrayOutline className="mb-4 h-16 w-16 text-muted-foreground/40" />
      <h3 className="mb-1 text-sm font-semibold text-foreground">No items yet</h3>
      <p className="mb-4 text-sm text-muted-foreground">
        Get started by creating the first one.
      </p>
      <Button size="sm" onClick={onCreateNew} className="gap-1.5">
        <Plus className="h-4 w-4" />
        {i18next.t('new')}
      </Button>
    </div>
  );
}
```

Create `src/components/admin/data-table/DataTableLoadMore.tsx`:

```tsx
import { Button } from '@/components/ui/button';

export function DataTableLoadMore({
  loadMore,
  error,
}: {
  loadMore: () => void;
  error: any;
}) {
  if (error) {
    return (
      <p className="my-4 text-center text-sm text-destructive">
        Failed to load more items ({String(error)})
      </p>
    );
  }
  return (
    <div className="mt-4 flex justify-center">
      <Button variant="outline" size="sm" onClick={loadMore}>
        Load more
      </Button>
    </div>
  );
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npm run test -- "DataTableSkeleton|DataTableEmptyState" 2>&1 | tail -10
```

Expected: PASS — 4 tests passing.

- [ ] **Step 5: Commit**

```bash
git add src/components/admin/data-table/
git commit -m "feat: add DataTableSkeleton, DataTableEmptyState, DataTableLoadMore"
```

---

### Task 2: DataTable component

**Files:**
- Create: `src/components/admin/data-table/DataTable.tsx`
- Create: `src/components/admin/data-table/DataTable.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `src/components/admin/data-table/DataTable.test.tsx`:

```tsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DataTable } from './DataTable';

vi.mock('@/components/ui/table', () => ({
  Table: ({ children }: any) => <table>{children}</table>,
  TableHeader: ({ children }: any) => <thead>{children}</thead>,
  TableBody: ({ children }: any) => <tbody>{children}</tbody>,
  TableRow: ({ children, onClick }: any) => <tr onClick={onClick}>{children}</tr>,
  TableHead: ({ children }: any) => <th>{children}</th>,
  TableCell: ({ children, onClick }: any) => <td onClick={onClick}>{children}</td>,
}));
vi.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, disabled, ...props }: any) => (
    <button onClick={onClick} disabled={disabled} {...props}>{children}</button>
  ),
}));
vi.mock('@/components/ui/input', () => ({
  Input: ({ value, onChange, onKeyDown, ...props }: any) => (
    <input value={value} onChange={onChange} onKeyDown={onKeyDown} {...props} />
  ),
}));
vi.mock('@/components/ui/checkbox', () => ({
  Checkbox: ({ checked, onCheckedChange }: any) => (
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onCheckedChange(e.target.checked)}
    />
  ),
}));
vi.mock('@/components/ui/tooltip', () => ({
  TooltipProvider: ({ children }: any) => <>{children}</>,
  Tooltip: ({ children }: any) => <>{children}</>,
  TooltipTrigger: ({ children, asChild }: any) => <>{children}</>,
  TooltipContent: ({ children }: any) => <span>{children}</span>,
}));
vi.mock('@components/admin/AdminTable/DeletionWarningModal', () => ({
  DeletionWarningModal: ({ showDeletionWarning, numberOfElements }: any) =>
    showDeletionWarning ? (
      <div data-testid="deletion-modal">Delete {numberOfElements}</div>
    ) : null,
}));
vi.mock('@hooks/use-config', () => ({
  default: () => ({ configs: null, getDisabledConfigItems: () => [] }),
}));
vi.mock('./DataTableSkeleton', () => ({
  DataTableSkeleton: () => <div data-testid="skeleton" />,
}));
vi.mock('./DataTableEmptyState', () => ({
  DataTableEmptyState: ({ onCreateNew }: any) => (
    <button onClick={onCreateNew} data-testid="empty-state">empty</button>
  ),
}));
vi.mock('./DataTableLoadMore', () => ({
  DataTableLoadMore: ({ loadMore }: any) => (
    <button onClick={loadMore} data-testid="load-more">load more</button>
  ),
}));

const COLUMNS = [
  { title: 'Name', dataIndex: 'name' as const, key: 'name' },
];

const ITEMS = [
  { _id: '1', key: '1', name: 'Alpha' },
  { _id: '2', key: '2', name: 'Beta' },
];

const BASE_PROPS = {
  items: ITEMS,
  isLoading: false,
  columns: COLUMNS,
  deleteItems: vi.fn().mockResolvedValue(true),
  rowSelection: { selectedRowKeys: [], onChange: vi.fn() },
  createNew: vi.fn(),
  editItem: vi.fn(),
  loadMore: vi.fn(),
  hasMore: false,
  error: null,
};

describe('DataTable', () => {
  beforeEach(() => vi.clearAllMocks());

  it('renders column headers', () => {
    render(<DataTable {...BASE_PROPS} />);
    expect(screen.getByText('Name')).toBeInTheDocument();
  });

  it('renders item rows', () => {
    render(<DataTable {...BASE_PROPS} />);
    expect(screen.getByText('Alpha')).toBeInTheDocument();
    expect(screen.getByText('Beta')).toBeInTheDocument();
  });

  it('shows skeleton when loading', () => {
    render(<DataTable {...BASE_PROPS} isLoading={true} />);
    expect(screen.getByTestId('skeleton')).toBeInTheDocument();
  });

  it('shows empty state when no items', () => {
    render(<DataTable {...BASE_PROPS} items={[]} />);
    expect(screen.getByTestId('empty-state')).toBeInTheDocument();
  });

  it('calls createNew when New button is clicked', () => {
    render(<DataTable {...BASE_PROPS} />);
    fireEvent.click(screen.getByRole('button', { name: /new/i }));
    expect(BASE_PROPS.createNew).toHaveBeenCalled();
  });

  it('calls editItem when row is clicked', () => {
    render(<DataTable {...BASE_PROPS} />);
    fireEvent.click(screen.getByText('Alpha').closest('tr')!);
    expect(BASE_PROPS.editItem).toHaveBeenCalledWith(ITEMS[0]);
  });

  it('shows load more when hasMore is true', () => {
    render(<DataTable {...BASE_PROPS} hasMore={true} />);
    expect(screen.getByTestId('load-more')).toBeInTheDocument();
  });

  it('shows search input when onSearchQueryChange is provided', () => {
    render(<DataTable {...BASE_PROPS} onSearchQueryChange={vi.fn()} />);
    expect(screen.getByPlaceholderText(/search/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm run test -- "DataTable.test" 2>&1 | tail -10
```

Expected: FAIL — `Cannot find module './DataTable'`

- [ ] **Step 3: Create the component**

Create `src/components/admin/data-table/DataTable.tsx`:

```tsx
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
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npm run test -- "DataTable.test" 2>&1 | tail -10
```

Expected: PASS — 8 tests passing.

- [ ] **Step 5: Commit**

```bash
git add src/components/admin/data-table/DataTable.tsx src/components/admin/data-table/DataTable.test.tsx
git commit -m "feat: add DataTable component replacing Flowbite AdminTable"
```

---

### Task 3: Update DeletionWarningModal (replace Flowbite Modal)

**Files:**
- Modify: `src/components/admin/AdminTable/DeletionWarningModal.tsx`
- Modify: `src/components/admin/AdminTable/DeletionWarningModal.test.tsx`

The file path stays the same so all existing imports keep working.

- [ ] **Step 1: Read the existing test**

```bash
cat src/components/admin/AdminTable/DeletionWarningModal.test.tsx
```

Note the current test structure — it mocks `flowbite-react`.

- [ ] **Step 2: Rewrite the test to use shadcn Dialog mocks**

Replace the contents of `src/components/admin/AdminTable/DeletionWarningModal.test.tsx` with:

```tsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DeletionWarningModal } from './DeletionWarningModal';

vi.mock('@/components/ui/dialog', () => ({
  Dialog: ({ open, children }: any) =>
    open ? <div data-testid="dialog">{children}</div> : null,
  DialogContent: ({ children }: any) => <div>{children}</div>,
  DialogHeader: ({ children }: any) => <div>{children}</div>,
  DialogTitle: ({ children }: any) => <h2>{children}</h2>,
  DialogDescription: ({ children }: any) => <p>{children}</p>,
  DialogFooter: ({ children }: any) => <div>{children}</div>,
}));

vi.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, variant }: any) => (
    <button onClick={onClick} data-variant={variant}>{children}</button>
  ),
}));

describe('DeletionWarningModal', () => {
  const toggleDeletionWarning = vi.fn();
  const deleteItems = vi.fn();

  beforeEach(() => vi.clearAllMocks());

  it('does not render when showDeletionWarning is false', () => {
    render(
      <DeletionWarningModal
        showDeletionWarning={false}
        toggleDeletionWarning={toggleDeletionWarning}
        numberOfElements={1}
        deleteItems={deleteItems}
      />,
    );
    expect(screen.queryByTestId('dialog')).not.toBeInTheDocument();
  });

  it('renders when showDeletionWarning is true', () => {
    render(
      <DeletionWarningModal
        showDeletionWarning={true}
        toggleDeletionWarning={toggleDeletionWarning}
        numberOfElements={2}
        deleteItems={deleteItems}
      />,
    );
    expect(screen.getByTestId('dialog')).toBeInTheDocument();
  });

  it('calls deleteItems and toggleDeletionWarning when confirmed', () => {
    render(
      <DeletionWarningModal
        showDeletionWarning={true}
        toggleDeletionWarning={toggleDeletionWarning}
        numberOfElements={1}
        deleteItems={deleteItems}
      />,
    );
    fireEvent.click(screen.getByText('yes_im_sure'));
    expect(deleteItems).toHaveBeenCalled();
    expect(toggleDeletionWarning).toHaveBeenCalled();
  });

  it('calls toggleDeletionWarning when cancelled', () => {
    render(
      <DeletionWarningModal
        showDeletionWarning={true}
        toggleDeletionWarning={toggleDeletionWarning}
        numberOfElements={1}
        deleteItems={deleteItems}
      />,
    );
    fireEvent.click(screen.getByText('no_cancel'));
    expect(toggleDeletionWarning).toHaveBeenCalled();
    expect(deleteItems).not.toHaveBeenCalled();
  });
});
```

- [ ] **Step 3: Run test to verify it fails**

```bash
npm run test -- DeletionWarningModal.test 2>&1 | tail -10
```

Expected: FAIL — still imports flowbite-react.

- [ ] **Step 4: Replace DeletionWarningModal.tsx**

Replace the contents of `src/components/admin/AdminTable/DeletionWarningModal.tsx` with:

```tsx
'use client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';
import i18next from 'i18next';

export function DeletionWarningModal({
  showDeletionWarning,
  toggleDeletionWarning,
  numberOfElements,
  deleteItems,
}: {
  showDeletionWarning: boolean;
  toggleDeletionWarning: () => void;
  numberOfElements: number;
  deleteItems: () => void;
}) {
  return (
    <Dialog open={showDeletionWarning} onOpenChange={toggleDeletionWarning}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Confirm Deletion
          </DialogTitle>
          <DialogDescription>
            {i18next.t(
              numberOfElements === 1
                ? 'deletion_confirmation_singular'
                : 'deletion_confirmation_plural',
            )}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={toggleDeletionWarning}>
            {i18next.t('no_cancel')}
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              toggleDeletionWarning();
              deleteItems();
            }}
          >
            {i18next.t('yes_im_sure')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
```

- [ ] **Step 5: Run test to verify it passes**

```bash
npm run test -- DeletionWarningModal.test 2>&1 | tail -10
```

Expected: PASS — 4 tests passing.

- [ ] **Step 6: Commit**

```bash
git add src/components/admin/AdminTable/DeletionWarningModal.tsx src/components/admin/AdminTable/DeletionWarningModal.test.tsx
git commit -m "feat: replace Flowbite Modal in DeletionWarningModal with shadcn Dialog"
```

---

### Task 4: Form primitives (FormInput, FormTextarea, FormSelect)

**Files:**
- Create: `src/components/admin/form/FormInput.tsx`
- Create: `src/components/admin/form/FormTextarea.tsx`
- Create: `src/components/admin/form/FormSelect.tsx`
- Create: `src/components/admin/form/FormInput.test.tsx`
- Create: `src/components/admin/form/FormTextarea.test.tsx`
- Create: `src/components/admin/form/FormSelect.test.tsx`

- [ ] **Step 1: Write the failing tests**

Create `src/components/admin/form/FormInput.test.tsx`:

```tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { FormInput } from './FormInput';

vi.mock('@/components/ui/input', () => ({
  Input: ({ id, name, placeholder, onChange, disabled, ...props }: any) => (
    <input id={id} name={name} placeholder={placeholder} onChange={onChange} disabled={disabled} {...props} />
  ),
}));
vi.mock('@/components/ui/label', () => ({
  Label: ({ children, htmlFor }: any) => <label htmlFor={htmlFor}>{children}</label>,
}));
vi.mock('@components/atom', () => ({ RedAsterisk: () => <span>*</span> }));

describe('FormInput', () => {
  it('renders label and input', () => {
    render(<FormInput disabled={false} name="title" label="Title" />);
    expect(screen.getByLabelText('Title')).toBeInTheDocument();
  });

  it('shows asterisk when required', () => {
    render(<FormInput disabled={false} name="title" label="Title" required />);
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('passes defaultValue to input', () => {
    render(<FormInput disabled={false} name="title" label="Title" defaultValue="hello" />);
    expect(screen.getByDisplayValue('hello')).toBeInTheDocument();
  });

  it('calls onChange when input changes', () => {
    const onChange = vi.fn();
    render(<FormInput disabled={false} name="title" label="Title" onChange={onChange} />);
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'test' } });
    expect(onChange).toHaveBeenCalled();
  });
});
```

Create `src/components/admin/form/FormTextarea.test.tsx`:

```tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FormTextarea } from './FormTextarea';

vi.mock('@/components/ui/textarea', () => ({
  Textarea: ({ id, name, placeholder, rows, ...props }: any) => (
    <textarea id={id} name={name} placeholder={placeholder} rows={rows} {...props} />
  ),
}));
vi.mock('@/components/ui/label', () => ({
  Label: ({ children, htmlFor }: any) => <label htmlFor={htmlFor}>{children}</label>,
}));
vi.mock('@components/atom', () => ({ RedAsterisk: () => <span>*</span> }));

describe('FormTextarea', () => {
  it('renders label and textarea', () => {
    render(<FormTextarea disabled={false} name="bio" label="Bio" />);
    expect(screen.getByLabelText('Bio')).toBeInTheDocument();
  });

  it('passes rows prop to textarea', () => {
    render(<FormTextarea disabled={false} name="bio" label="Bio" rows={5} />);
    expect(screen.getByRole('textbox')).toHaveAttribute('rows', '5');
  });
});
```

Create `src/components/admin/form/FormSelect.test.tsx`:

```tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FormSelect } from './FormSelect';

vi.mock('@/components/ui/select', () => ({
  Select: ({ children, onValueChange, value, disabled }: any) => (
    <div data-testid="select" data-value={value} data-disabled={disabled}>{children}</div>
  ),
  SelectTrigger: ({ children }: any) => <button>{children}</button>,
  SelectValue: ({ placeholder }: any) => <span>{placeholder}</span>,
  SelectContent: ({ children }: any) => <div>{children}</div>,
  SelectItem: ({ children, value }: any) => <div data-value={value}>{children}</div>,
}));
vi.mock('@/components/ui/label', () => ({
  Label: ({ children, htmlFor }: any) => <label htmlFor={htmlFor}>{children}</label>,
}));
vi.mock('@components/atom', () => ({ RedAsterisk: () => <span>*</span> }));

const OPTIONS = [
  { _id: '1', name: 'Option A' },
  { _id: '2', name: 'Option B' },
];

describe('FormSelect', () => {
  it('renders label', () => {
    render(
      <FormSelect
        disabled={false}
        loadingItems={false}
        options={OPTIONS}
        name="grade"
        label="Grade"
      />,
    );
    expect(screen.getByText('Grade')).toBeInTheDocument();
  });

  it('renders options', () => {
    render(
      <FormSelect
        disabled={false}
        loadingItems={false}
        options={OPTIONS}
        name="grade"
        label="Grade"
      />,
    );
    expect(screen.getByText('Option A')).toBeInTheDocument();
    expect(screen.getByText('Option B')).toBeInTheDocument();
  });

  it('shows loading state when loadingItems is true', () => {
    render(
      <FormSelect
        disabled={false}
        loadingItems={true}
        options={[]}
        name="grade"
        label="Grade"
      />,
    );
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npm run test -- "FormInput.test|FormTextarea.test|FormSelect.test" 2>&1 | tail -10
```

Expected: FAIL — modules not found.

- [ ] **Step 3: Create FormInput**

Create `src/components/admin/form/FormInput.tsx`:

```tsx
'use client';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RedAsterisk } from '@components/atom';
import { ChangeEventHandler, FocusEventHandler, FormEventHandler } from 'react';

export function FormInput({
  disabled,
  name,
  label,
  defaultValue,
  required,
  onChange,
  onInput,
  onBlur,
}: {
  disabled: boolean;
  name: string;
  label: string;
  defaultValue?: string;
  required?: boolean;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  onInput?: FormEventHandler<HTMLInputElement>;
  onBlur?: FocusEventHandler<HTMLInputElement>;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={name}>
        {label} {required && <RedAsterisk />}
      </Label>
      <Input
        id={name}
        name={name}
        placeholder={label}
        defaultValue={defaultValue}
        disabled={disabled}
        required={required}
        onChange={onChange}
        onInput={onInput}
        onBlur={onBlur}
      />
    </div>
  );
}
```

- [ ] **Step 4: Create FormTextarea**

Create `src/components/admin/form/FormTextarea.tsx`:

```tsx
'use client';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RedAsterisk } from '@components/atom';
import { ChangeEventHandler, FocusEventHandler, FormEventHandler } from 'react';

export function FormTextarea({
  disabled,
  name,
  label,
  defaultValue,
  required,
  rows,
  onChange,
  onInput,
  onBlur,
}: {
  disabled: boolean;
  name: string;
  label: string;
  defaultValue?: string;
  required?: boolean;
  rows?: number;
  onChange?: ChangeEventHandler<HTMLTextAreaElement>;
  onInput?: FormEventHandler<HTMLTextAreaElement>;
  onBlur?: FocusEventHandler<HTMLTextAreaElement>;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={name}>
        {label} {required && <RedAsterisk />}
      </Label>
      <Textarea
        id={name}
        name={name}
        placeholder={label}
        defaultValue={defaultValue}
        disabled={disabled}
        required={required}
        rows={rows}
        onChange={onChange}
        onInput={onInput}
        onBlur={onBlur}
        className="custom-scrollbar resize-none"
      />
    </div>
  );
}
```

- [ ] **Step 5: Create FormSelect**

Create `src/components/admin/form/FormSelect.tsx`:

```tsx
'use client';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { RedAsterisk } from '@components/atom';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';

export function FormSelect({
  disabled,
  loadingItems,
  options,
  name,
  label,
  defaultValue,
  required,
}: {
  name: string;
  label: string;
  disabled: boolean;
  loadingItems: boolean;
  options: Array<{ _id: string; name: string }>;
  defaultValue?: string;
  required?: boolean;
}) {
  const [selected, setSelected] = useState(defaultValue ?? '');

  return (
    <div className="space-y-1.5">
      <Label htmlFor={name}>
        {label} {required && <RedAsterisk />}
      </Label>
      {loadingItems ? (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="text-sm">Loading...</span>
        </div>
      ) : (
        <>
          {/* Hidden native input for form submission */}
          <input type="hidden" name={name} value={selected} />
          <Select
            value={selected}
            onValueChange={setSelected}
            disabled={disabled}
            required={required}
          >
            <SelectTrigger id={name}>
              <SelectValue placeholder={`Select ${label}`} />
            </SelectTrigger>
            <SelectContent>
              {options.map((item) => (
                <SelectItem key={item._id} value={item._id}>
                  {item.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </>
      )}
    </div>
  );
}
```

- [ ] **Step 6: Run tests to verify they pass**

```bash
npm run test -- "FormInput.test|FormTextarea.test|FormSelect.test" 2>&1 | tail -10
```

Expected: PASS — 9 tests passing across 3 files.

- [ ] **Step 7: Commit**

```bash
git add src/components/admin/form/FormInput.tsx src/components/admin/form/FormInput.test.tsx \
        src/components/admin/form/FormTextarea.tsx src/components/admin/form/FormTextarea.test.tsx \
        src/components/admin/form/FormSelect.tsx src/components/admin/form/FormSelect.test.tsx
git commit -m "feat: add FormInput, FormTextarea, FormSelect using shadcn primitives"
```

---

### Task 5: FormSheet component

**Files:**
- Create: `src/components/admin/form/FormSheet.tsx`
- Create: `src/components/admin/form/FormSheet.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `src/components/admin/form/FormSheet.test.tsx`:

```tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { FormSheet } from './FormSheet';

vi.mock('@/components/ui/sheet', () => ({
  Sheet: ({ open, onOpenChange, children }: any) =>
    open ? <div data-testid="sheet" onClick={() => onOpenChange(false)}>{children}</div> : null,
  SheetContent: ({ children }: any) => <div data-testid="sheet-content">{children}</div>,
  SheetHeader: ({ children }: any) => <div>{children}</div>,
  SheetTitle: ({ children }: any) => <h2>{children}</h2>,
}));
vi.mock('@/components/ui/scroll-area', () => ({
  ScrollArea: ({ children }: any) => <div>{children}</div>,
}));

describe('FormSheet', () => {
  it('renders children when open', () => {
    render(
      <FormSheet open={true} onClose={vi.fn()} title="Edit Grade">
        <p>form content</p>
      </FormSheet>,
    );
    expect(screen.getByText('form content')).toBeInTheDocument();
  });

  it('renders the title', () => {
    render(
      <FormSheet open={true} onClose={vi.fn()} title="Edit Grade">
        <p>form</p>
      </FormSheet>,
    );
    expect(screen.getByText('Edit Grade')).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    render(
      <FormSheet open={false} onClose={vi.fn()} title="Edit Grade">
        <p>form content</p>
      </FormSheet>,
    );
    expect(screen.queryByText('form content')).not.toBeInTheDocument();
  });

  it('calls onClose when sheet requests close', () => {
    const onClose = vi.fn();
    render(
      <FormSheet open={true} onClose={onClose} title="Edit">
        <p>form</p>
      </FormSheet>,
    );
    fireEvent.click(screen.getByTestId('sheet'));
    expect(onClose).toHaveBeenCalled();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm run test -- FormSheet.test 2>&1 | tail -10
```

Expected: FAIL — `Cannot find module './FormSheet'`

- [ ] **Step 3: Create the component**

Create `src/components/admin/form/FormSheet.tsx`:

```tsx
'use client';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ReactNode } from 'react';

export function FormSheet({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}) {
  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent
        side="right"
        className="flex w-full flex-col p-0 sm:max-w-[460px] lg:max-w-[560px]"
      >
        <SheetHeader className="border-b border-border px-6 pb-4 pt-6">
          <SheetTitle>{title}</SheetTitle>
        </SheetHeader>
        <ScrollArea className="flex-1 px-6 py-4 custom-scrollbar">
          {children}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npm run test -- FormSheet.test 2>&1 | tail -10
```

Expected: PASS — 4 tests passing.

- [ ] **Step 5: Run full test suite**

```bash
npm run test 2>&1 | tail -15
```

Expected: all tests pass.

- [ ] **Step 6: Commit**

```bash
git add src/components/admin/form/FormSheet.tsx src/components/admin/form/FormSheet.test.tsx
git commit -m "feat: add FormSheet side-drawer component using shadcn Sheet"
```

---

### Plan 4 Complete

All shared components are in place. Proceed to **Plan 5: List Pages**.
