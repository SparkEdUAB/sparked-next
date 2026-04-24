import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import CreateProgramView from './createProgramView';

vi.mock('@hooks/useProgram', () => ({
  default: () => ({ createProgram: vi.fn(), isLoading: false }),
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

vi.mock('@components/admin/form/FormInput', () => ({
  FormInput: ({ label, name }: any) => <input aria-label={label} name={name} />,
}));

vi.mock('@components/admin/form/FormSelect', () => ({
  FormSelect: ({ label, name }: any) => <select aria-label={label} name={name} />,
}));

vi.mock('@components/layouts', () => ({
  AdminPageTitle: ({ title }: any) => <h1>{title}</h1>,
}));

describe('CreateProgramView', () => {
  it('renders name, description inputs and school selector', () => {
    render(<CreateProgramView />);
    expect(document.querySelector('input[name="name"]')).toBeTruthy();
    expect(document.querySelector('input[name="description"]')).toBeTruthy();
    expect(document.querySelector('select[name="schoolId"]')).toBeTruthy();
  });

  it('renders submit button', () => {
    render(<CreateProgramView />);
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });
});
