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
