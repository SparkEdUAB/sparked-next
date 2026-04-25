import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FormSelect } from './FormSelect';

vi.mock('@/components/ui/select', () => ({
  Select: ({ children, onValueChange: _onValueChange, value, disabled }: any) => (
    <div data-testid="select" data-value={value} data-disabled={disabled}>{children}</div>
  ),
  SelectTrigger: ({ children }: any) => <button>{children}</button>,
  SelectValue: ({ placeholder }: any) => <span>{placeholder}</span>,
  SelectContent: ({ children }: any) => <div>{children}</div>,
  SelectItem: ({ children, value }: any) => <div data-value={value}>{children}</div>,
}));
vi.mock('@/components/ui/label', () => ({
  Label: ({ children, htmlFor }: any) => <label htmlFor={htmlFor}>{children}</label>,
}));
vi.mock('@components/atom', () => ({ RedAsterisk: () => <span>*</span> }));

const OPTIONS = [
  { _id: '1', name: 'Option A' },
  { _id: '2', name: 'Option B' },
];

describe('FormSelect', () => {
  it('renders label', () => {
    render(
      <FormSelect
        disabled={false}
        loadingItems={false}
        options={OPTIONS}
        name="grade"
        label="Grade"
      />,
    );
    expect(screen.getByText('Grade')).toBeInTheDocument();
  });

  it('renders options', () => {
    render(
      <FormSelect
        disabled={false}
        loadingItems={false}
        options={OPTIONS}
        name="grade"
        label="Grade"
      />,
    );
    expect(screen.getByText('Option A')).toBeInTheDocument();
    expect(screen.getByText('Option B')).toBeInTheDocument();
  });

  it('shows loading state when loadingItems is true', () => {
    render(
      <FormSelect
        disabled={false}
        loadingItems={true}
        options={[]}
        name="grade"
        label="Grade"
      />,
    );
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });
});
