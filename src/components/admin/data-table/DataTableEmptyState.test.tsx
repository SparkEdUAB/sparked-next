import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DataTableEmptyState } from './DataTableEmptyState';

vi.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick }: any) => <button onClick={onClick}>{children}</button>,
}));

describe('DataTableEmptyState', () => {
  it('renders empty state message', () => {
    render(<DataTableEmptyState onCreateNew={vi.fn()} />);
    expect(screen.getByText('No items yet')).toBeInTheDocument();
  });

  it('calls onCreateNew when create button is clicked', () => {
    const onCreateNew = vi.fn();
    render(<DataTableEmptyState onCreateNew={onCreateNew} />);
    fireEvent.click(screen.getByRole('button'));
    expect(onCreateNew).toHaveBeenCalled();
  });
});
