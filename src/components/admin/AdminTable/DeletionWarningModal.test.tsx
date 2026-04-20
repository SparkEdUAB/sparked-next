import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DeletionWarningModal } from './DeletionWarningModal';

vi.mock('@/components/ui/dialog', () => ({
  Dialog: ({ open, children }: any) =>
    open ? <div data-testid="dialog">{children}</div> : null,
  DialogContent: ({ children }: any) => <div>{children}</div>,
  DialogHeader: ({ children }: any) => <div>{children}</div>,
  DialogTitle: ({ children }: any) => <h2>{children}</h2>,
  DialogDescription: ({ children }: any) => <p>{children}</p>,
  DialogFooter: ({ children }: any) => <div>{children}</div>,
}));

vi.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, variant }: any) => (
    <button onClick={onClick} data-variant={variant}>{children}</button>
  ),
}));

describe('DeletionWarningModal', () => {
  const toggleDeletionWarning = vi.fn();
  const deleteItems = vi.fn();

  beforeEach(() => vi.clearAllMocks());

  it('does not render when showDeletionWarning is false', () => {
    render(
      <DeletionWarningModal
        showDeletionWarning={false}
        toggleDeletionWarning={toggleDeletionWarning}
        numberOfElements={1}
        deleteItems={deleteItems}
      />,
    );
    expect(screen.queryByTestId('dialog')).not.toBeInTheDocument();
  });

  it('renders when showDeletionWarning is true', () => {
    render(
      <DeletionWarningModal
        showDeletionWarning={true}
        toggleDeletionWarning={toggleDeletionWarning}
        numberOfElements={2}
        deleteItems={deleteItems}
      />,
    );
    expect(screen.getByTestId('dialog')).toBeInTheDocument();
  });

  it('calls deleteItems and toggleDeletionWarning when confirmed', () => {
    render(
      <DeletionWarningModal
        showDeletionWarning={true}
        toggleDeletionWarning={toggleDeletionWarning}
        numberOfElements={1}
        deleteItems={deleteItems}
      />,
    );
    fireEvent.click(screen.getByText('yes_im_sure'));
    expect(deleteItems).toHaveBeenCalled();
    expect(toggleDeletionWarning).toHaveBeenCalled();
  });

  it('calls toggleDeletionWarning when cancelled', () => {
    render(
      <DeletionWarningModal
        showDeletionWarning={true}
        toggleDeletionWarning={toggleDeletionWarning}
        numberOfElements={1}
        deleteItems={deleteItems}
      />,
    );
    fireEvent.click(screen.getByText('no_cancel'));
    expect(toggleDeletionWarning).toHaveBeenCalled();
    expect(deleteItems).not.toHaveBeenCalled();
  });
});
