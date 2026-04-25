import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { FormSheet } from './FormSheet';

vi.mock('@/components/ui/sheet', () => ({
  Sheet: ({ open, onOpenChange, children }: any) =>
    open ? <div data-testid="sheet" onClick={() => onOpenChange(false)}>{children}</div> : null,
  SheetContent: ({ children }: any) => <div data-testid="sheet-content">{children}</div>,
  SheetHeader: ({ children }: any) => <div>{children}</div>,
  SheetTitle: ({ children }: any) => <h2>{children}</h2>,
}));
vi.mock('@/components/ui/scroll-area', () => ({
  ScrollArea: ({ children }: any) => <div>{children}</div>,
}));

describe('FormSheet', () => {
  it('renders children when open', () => {
    render(
      <FormSheet open={true} onClose={vi.fn()} title="Edit Grade">
        <p>form content</p>
      </FormSheet>,
    );
    expect(screen.getByText('form content')).toBeInTheDocument();
  });

  it('renders the title', () => {
    render(
      <FormSheet open={true} onClose={vi.fn()} title="Edit Grade">
        <p>form</p>
      </FormSheet>,
    );
    expect(screen.getByText('Edit Grade')).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    render(
      <FormSheet open={false} onClose={vi.fn()} title="Edit Grade">
        <p>form content</p>
      </FormSheet>,
    );
    expect(screen.queryByText('form content')).not.toBeInTheDocument();
  });

  it('calls onClose when sheet requests close', () => {
    const onClose = vi.fn();
    render(
      <FormSheet open={true} onClose={onClose} title="Edit">
        <p>form</p>
      </FormSheet>,
    );
    fireEvent.click(screen.getByTestId('sheet'));
    expect(onClose).toHaveBeenCalled();
  });
});
