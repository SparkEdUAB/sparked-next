import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AdminTableButtonGroup } from './AdminTableButtonGroup';
import React from 'react';

vi.mock('flowbite-react', () => {
  const Button = ({ children, onClick, disabled, ...props }: any) => (
    <button onClick={onClick} disabled={disabled} {...props}>{children}</button>
  );
  Button.Group = ({ children, ...props }: any) => <div data-testid="button-group" {...props}>{children}</div>;
  return { Button };
});

vi.mock('react-icons/io', () => ({
  IoMdAddCircleOutline: () => <span data-testid="add-icon" />,
}));

vi.mock('react-icons/ri', () => ({
  RiDeleteBin6Line: () => <span data-testid="delete-icon" />,
}));

const mockWarning = vi.fn();
vi.mock('providers/ToastMessageContext', () => ({
  useToastMessage: () => ({ warning: mockWarning }),
}));

describe('AdminTableButtonGroup', () => {
  const createNew = vi.fn();
  const toggleDeletionWarning = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders new and delete buttons', () => {
    render(
      <AdminTableButtonGroup
        createNew={createNew}
        rowSelection={{ selectedRowKeys: [], onChange: vi.fn() }}
        toggleDeletionWarning={toggleDeletionWarning}
      />,
    );
    expect(screen.getByText('new')).toBeInTheDocument();
    expect(screen.getByText('delete')).toBeInTheDocument();
  });

  it('new button calls createNew', () => {
    render(
      <AdminTableButtonGroup
        createNew={createNew}
        rowSelection={{ selectedRowKeys: [], onChange: vi.fn() }}
        toggleDeletionWarning={toggleDeletionWarning}
      />,
    );
    fireEvent.click(screen.getByText('new'));
    expect(createNew).toHaveBeenCalled();
  });

  it('delete button is disabled when no selection', () => {
    render(
      <AdminTableButtonGroup
        createNew={createNew}
        rowSelection={{ selectedRowKeys: [], onChange: vi.fn() }}
        toggleDeletionWarning={toggleDeletionWarning}
      />,
    );
    const deleteBtn = screen.getByText('delete').closest('button')!;
    expect(deleteBtn).toBeDisabled();
  });

  it('delete button calls toggleDeletionWarning when items selected', () => {
    render(
      <AdminTableButtonGroup
        createNew={createNew}
        rowSelection={{ selectedRowKeys: ['1', '2'], onChange: vi.fn() }}
        toggleDeletionWarning={toggleDeletionWarning}
      />,
    );
    fireEvent.click(screen.getByText('delete').closest('button')!);
    expect(toggleDeletionWarning).toHaveBeenCalled();
  });

  it('renders additionalButtons', () => {
    render(
      <AdminTableButtonGroup
        createNew={createNew}
        rowSelection={{ selectedRowKeys: [], onChange: vi.fn() }}
        toggleDeletionWarning={toggleDeletionWarning}
        additionalButtons={<button>Extra</button>}
      />,
    );
    expect(screen.getByText('Extra')).toBeInTheDocument();
  });
});
