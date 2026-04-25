import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import CreateCourseView from './createCourseView';

vi.mock('@hooks/useCourse', () => ({
  default: () => ({ createCourse: vi.fn(), isLoading: false }),
}));

vi.mock('@components/admin/form/FormInput', () => ({
  FormInput: ({ label, name }: any) => <input aria-label={label} name={name} />,
}));

vi.mock('@components/layouts', () => ({
  AdminPageTitle: ({ title }: any) => <h1>{title}</h1>,
}));

describe('CreateCourseView', () => {
  it('renders name and description inputs', () => {
    render(<CreateCourseView />);
    expect(document.querySelector('input[name="name"]')).toBeTruthy();
    expect(document.querySelector('input[name="description"]')).toBeTruthy();
  });

  it('renders submit button', () => {
    render(<CreateCourseView />);
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });
});
