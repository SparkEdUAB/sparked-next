import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import EditSchoolView from './editSchoolView';

vi.mock('next/navigation', () => ({
  useSearchParams: () => ({ get: () => null }),
}));

vi.mock('@hooks/useSchool', () => ({
  default: () => ({
    editSchool: vi.fn(),
    fetchSchool: vi.fn(),
    school: { _id: '1', name: 'Test School', description: 'Desc', index: 0, key: '1', created_by: '', created_at: '', user: { name: '', email: '' } },
    isLoading: false,
  }),
}));

vi.mock('providers/ToastMessageContext', () => ({
  useToastMessage: () => ({ error: vi.fn() }),
}));

vi.mock('@components/admin/form/FormInput', () => ({
  FormInput: ({ label, name, defaultValue }: any) => (
    <input aria-label={label} name={name} defaultValue={defaultValue} />
  ),
}));

vi.mock('@components/layouts', () => ({
  AdminPageTitle: ({ title }: any) => <h1>{title}</h1>,
}));

describe('EditSchoolView', () => {
  it('renders the form with school data', () => {
    render(<EditSchoolView schoolId="1" />);
    expect(screen.getByDisplayValue('Test School')).toBeInTheDocument();
  });

  it('renders update button', () => {
    render(<EditSchoolView schoolId="1" />);
    expect(screen.getByRole('button', { name: /update/i })).toBeInTheDocument();
  });
});
