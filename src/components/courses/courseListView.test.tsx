import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import CourseListView from './courseListView';

vi.mock('@hooks/useCourse', () => ({
  default: () => ({
    selectedCourseIds: [],
    setSelectedCourseIds: vi.fn(),
    onSearchQueryChange: vi.fn(),
    deleteCourse: vi.fn().mockResolvedValue(true),
    searchQuery: '',
  }),
  transformRawCourse: (x: any) => x,
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
      <button onClick={() => editItem({ _id: 'c1', name: 'C', description: '', index: 0, key: 'c1', created_at: '' })}>Edit</button>
    </div>
  ),
}));

vi.mock('@components/admin/form/FormSheet', () => ({
  FormSheet: ({ open, title, children }: any) =>
    open ? <div data-testid="form-sheet" data-title={title}>{children}</div> : null,
}));

vi.mock('./createCourseView', () => ({
  default: () => <div data-testid="create-course-view" />,
}));

vi.mock('./editCourseView', () => ({
  default: () => <div data-testid="edit-course-view" />,
}));

describe('CourseListView', () => {
  it('renders the data table', () => {
    render(<CourseListView />);
    expect(screen.getByTestId('data-table')).toBeInTheDocument();
  });

  it('opens create sheet when createNew triggered', () => {
    render(<CourseListView />);
    fireEvent.click(screen.getByText('New'));
    expect(screen.getByTestId('create-course-view')).toBeInTheDocument();
  });

  it('opens edit sheet when editItem triggered', () => {
    render(<CourseListView />);
    fireEvent.click(screen.getByText('Edit'));
    expect(screen.getByTestId('edit-course-view')).toBeInTheDocument();
  });
});
