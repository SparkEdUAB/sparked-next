import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import EditCourseView from './editCourseView';
import { T_CourseFields } from '@hooks/useCourse/types';

vi.mock('@hooks/useCourse', () => ({
  default: () => ({ editCourse: vi.fn(), deleteCourse: vi.fn().mockResolvedValue(true) }),
}));

vi.mock('@components/admin/form/FormInput', () => ({
  FormInput: ({ label, name, defaultValue }: any) => (
    <input aria-label={label} name={name} defaultValue={defaultValue} />
  ),
}));

vi.mock('@components/layouts', () => ({
  AdminPageTitle: ({ title }: any) => <h1>{title}</h1>,
}));

vi.mock('@components/library/LibraryErrorMessage/LibraryErrorMessage', () => ({
  LibraryErrorMessage: ({ children }: any) => <div>{children}</div>,
}));

vi.mock('@components/admin/AdminTable/DeletionWarningModal', () => ({
  DeletionWarningModal: ({ showDeletionWarning }: any) =>
    showDeletionWarning ? <div data-testid="deletion-modal" /> : null,
}));

const mockCourse: T_CourseFields = {
  _id: 'c1',
  name: 'Test Course',
  description: 'A course',
  index: 0,
  key: 'c1',
  created_at: '',
  school: undefined,
  schoolId: undefined,
  programId: undefined,
  schoolName: undefined,
  programName: undefined,
};

describe('EditCourseView', () => {
  it('renders form with course data', () => {
    render(<EditCourseView course={mockCourse} onSuccessfullyDone={vi.fn()} />);
    expect(screen.getByDisplayValue('Test Course')).toBeInTheDocument();
  });

  it('renders update and delete buttons', () => {
    render(<EditCourseView course={mockCourse} onSuccessfullyDone={vi.fn()} />);
    expect(screen.getByRole('button', { name: /update/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();
  });
});
