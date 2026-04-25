import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import CreateSchoolView from './createSchoolView';

vi.mock('@hooks/useSchool', () => ({
  default: () => ({ createSchool: vi.fn(), isLoading: false }),
}));

vi.mock('@components/admin/form/FormInput', () => ({
  FormInput: ({ label, name }: any) => <input aria-label={label} name={name} />,
}));

vi.mock('@components/layouts', () => ({
  AdminPageTitle: ({ title }: any) => <h1>{title}</h1>,
}));

describe('CreateSchoolView', () => {
  it('renders name and description inputs', () => {
    render(<CreateSchoolView />);
    expect(document.querySelector('input[name="name"]')).toBeTruthy();
    expect(document.querySelector('input[name="description"]')).toBeTruthy();
  });

  it('renders submit button', () => {
    render(<CreateSchoolView />);
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });
});
