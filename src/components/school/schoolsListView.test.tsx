import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import SchoolsListView from './schoolsListView';

vi.mock('@hooks/useSchool', () => ({
  default: () => ({
    selectedSchoolIds: [],
    setSelectedSchoolIds: vi.fn(),
    onSearchQueryChange: vi.fn(),
    deleteSchools: vi.fn().mockResolvedValue(true),
    searchQuery: '',
  }),
  transformRawSchool: (x: any) => x,
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
  DataTable: ({ createNew }: any) => (
    <div data-testid="data-table">
      <button onClick={createNew}>New</button>
    </div>
  ),
}));

vi.mock('@components/admin/form/FormSheet', () => ({
  FormSheet: ({ open, title, children }: any) =>
    open ? <div data-testid="form-sheet" data-title={title}>{children}</div> : null,
}));

vi.mock('./createSchoolView', () => ({
  default: () => <div data-testid="create-school-view" />,
}));

vi.mock('./editSchoolView', () => ({
  default: () => <div data-testid="edit-school-view" />,
}));

describe('SchoolsListView', () => {
  it('renders the data table', () => {
    render(<SchoolsListView />);
    expect(screen.getByTestId('data-table')).toBeInTheDocument();
  });

  it('opens create sheet when createNew triggered', () => {
    render(<SchoolsListView />);
    fireEvent.click(screen.getByText('New'));
    expect(screen.getByTestId('form-sheet')).toBeInTheDocument();
    expect(screen.getByTestId('create-school-view')).toBeInTheDocument();
  });
});
