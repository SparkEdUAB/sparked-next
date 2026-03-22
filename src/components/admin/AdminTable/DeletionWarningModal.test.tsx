import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DeletionWarningModal } from './DeletionWarningModal';

vi.mock('flowbite-react', () => {
  const Modal = ({ children, show, onClose, ...props }: any) =>
    show ? <div data-testid="modal" {...props}>{children}</div> : null;
  Modal.Header = () => <div data-testid="modal-header" />;
  Modal.Body = ({ children }: any) => <div>{children}</div>;
  return {
    Modal,
    Button: ({ children, onClick, ...props }: any) => (
      <button onClick={onClick} {...props}>{children}</button>
    ),
  };
});

vi.mock('react-icons/hi', () => ({
  HiOutlineExclamationCircle: () => <span data-testid="warning-icon" />,
}));

describe('DeletionWarningModal', () => {
  const defaultProps = {
    showDeletionWarning: true,
    toggleDeletionWarning: vi.fn(),
    numberOfElements: 1,
    deleteItems: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('is hidden when showDeletionWarning is false', () => {
    render(<DeletionWarningModal {...defaultProps} showDeletionWarning={false} />);
    expect(screen.queryByTestId('modal')).toBeNull();
  });

  it('is visible when showDeletionWarning is true', () => {
    render(<DeletionWarningModal {...defaultProps} />);
    expect(screen.getByTestId('modal')).toBeInTheDocument();
  });

  it('shows singular text for 1 element', () => {
    render(<DeletionWarningModal {...defaultProps} numberOfElements={1} />);
    expect(screen.getByText('deletion_confirmation_singular')).toBeInTheDocument();
  });

  it('shows plural text for multiple elements', () => {
    render(<DeletionWarningModal {...defaultProps} numberOfElements={3} />);
    expect(screen.getByText('deletion_confirmation_plural')).toBeInTheDocument();
  });

  it('Yes button calls toggleDeletionWarning and deleteItems', () => {
    render(<DeletionWarningModal {...defaultProps} />);
    fireEvent.click(screen.getByText('yes_im_sure'));
    expect(defaultProps.toggleDeletionWarning).toHaveBeenCalled();
    expect(defaultProps.deleteItems).toHaveBeenCalled();
  });

  it('Cancel button calls toggleDeletionWarning', () => {
    render(<DeletionWarningModal {...defaultProps} />);
    fireEvent.click(screen.getByText('no_cancel'));
    expect(defaultProps.toggleDeletionWarning).toHaveBeenCalled();
  });
});
