import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ProgramsListView from './programListView';

vi.mock('@hooks/useProgram', () => ({
  default: () => ({
    selectedProgramIds: [],
    setSelectedProgramIds: vi.fn(),
    onSearchQueryChange: vi.fn(),
    deletePrograms: vi.fn().mockResolvedValue(true),
    searchQuery: '',
  }),
  transformRawProgram: (x: any) => x,
}));

vi.mock('@hooks/useAdmin/useAdminListViewData', () => ({
  useAdminListViewData: () => ({
    items: [],
    isLoading: false,
    mutate: vi.fn(),
    loadMore: vi.fn(),
    hasMore: false,
    error: null,
  }),
}));

vi.mock('@components/admin/data-table/DataTable', () => ({
  DataTable: ({ createNew, editItem }: any) => (
    <div data-testid="data-table">
      <button onClick={createNew}>New</button>
      <button onClick={() => editItem({ _id: 'p1', name: 'P', description: '', schoolId: '', schoolName: '', index: 0, key: 'p1', created_at: '' })}>Edit</button>
    </div>
  ),
}));

vi.mock('@components/admin/form/FormSheet', () => ({
  FormSheet: ({ open, title, children }: any) =>
    open ? <div data-testid="form-sheet" data-title={title}>{children}</div> : null,
}));

vi.mock('./createProgramView', () => ({
  default: () => <div data-testid="create-program-view" />,
}));

vi.mock('./editProgramView', () => ({
  default: () => <div data-testid="edit-program-view" />,
}));

describe('ProgramsListView', () => {
  it('renders the data table', () => {
    render(<ProgramsListView />);
    expect(screen.getByTestId('data-table')).toBeInTheDocument();
  });

  it('opens create sheet when createNew triggered', () => {
    render(<ProgramsListView />);
    fireEvent.click(screen.getByText('New'));
    expect(screen.getByTestId('create-program-view')).toBeInTheDocument();
  });

  it('opens edit sheet when editItem triggered', () => {
    render(<ProgramsListView />);
    fireEvent.click(screen.getByText('Edit'));
    expect(screen.getByTestId('edit-program-view')).toBeInTheDocument();
  });
});
