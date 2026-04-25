import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import EditProgramView from './editProgramView';

vi.mock('next/navigation', () => ({
  useSearchParams: () => ({ get: () => null }),
}));

vi.mock('@hooks/useProgram', () => ({
  default: () => ({ editProgram: vi.fn() }),
  transformRawProgram: (x: any) => x,
}));

vi.mock('@hooks/useAdmin/useAdminItemById', () => ({
  useAdminItemById: () => ({
    item: { _id: 'p1', name: 'Test Program', description: 'Desc', schoolId: 's1', schoolName: 'School', index: 0, key: 'p1', created_at: '' },
    isLoading: false,
  }),
}));

vi.mock('@hooks/useAdmin/useAdminListViewData', () => ({
  useAdminListViewData: () => ({
    items: [{ _id: 's1', name: 'School 1' }],
    isLoading: false,
  }),
}));

vi.mock('@hooks/useSchool', () => ({
  transformRawSchool: (x: any) => x,
}));

vi.mock('providers/ToastMessageContext', () => ({
  useToastMessage: () => ({ error: vi.fn() }),
}));

vi.mock('@components/admin/form/FormInput', () => ({
  FormInput: ({ label, name, defaultValue }: any) => (
    <input aria-label={label} name={name} defaultValue={defaultValue} />
  ),
}));

vi.mock('@components/admin/form/FormSelect', () => ({
  FormSelect: ({ label, name, defaultValue }: any) => (
    <select aria-label={label} name={name} defaultValue={defaultValue} />
  ),
}));

vi.mock('@components/layouts', () => ({
  AdminPageTitle: ({ title }: any) => <h1>{title}</h1>,
}));

vi.mock('@components/library/LibraryErrorMessage/LibraryErrorMessage', () => ({
  LibraryErrorMessage: ({ children }: any) => <div>{children}</div>,
}));

describe('EditProgramView', () => {
  it('renders form with program data', () => {
    render(<EditProgramView programId="p1" />);
    expect(screen.getByDisplayValue('Test Program')).toBeInTheDocument();
  });

  it('renders update button', () => {
    render(<EditProgramView programId="p1" />);
    expect(screen.getByRole('button', { name: /update/i })).toBeInTheDocument();
  });
});
