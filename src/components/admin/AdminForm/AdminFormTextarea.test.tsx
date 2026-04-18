import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AdminFormTextarea } from './AdminFormTextarea';

vi.mock('flowbite-react', () => ({
  Label: ({ children, ...props }: any) => <label {...props}>{children}</label>,
  Textarea: (props: any) => <textarea {...props} />,
}));

vi.mock('@components/atom', () => ({
  RedAsterisk: () => <span data-testid="red-asterisk">*</span>,
}));

describe('AdminFormTextarea', () => {
  it('renders label text', () => {
    render(<AdminFormTextarea disabled={false} name="desc" label="Description" />);
    expect(screen.getByText('Description')).toBeInTheDocument();
  });

  it('sets name attribute on textarea', () => {
    render(<AdminFormTextarea disabled={false} name="desc" label="Description" />);
    expect(screen.getByRole('textbox')).toHaveAttribute('name', 'desc');
  });

  it('shows red asterisk when required', () => {
    render(<AdminFormTextarea disabled={false} name="desc" label="Description" required />);
    expect(screen.getByTestId('red-asterisk')).toBeInTheDocument();
  });

  it('passes disabled state', () => {
    render(<AdminFormTextarea disabled={true} name="desc" label="Description" />);
    expect(screen.getByRole('textbox')).toBeDisabled();
  });

  it('passes rows prop', () => {
    render(<AdminFormTextarea disabled={false} name="desc" label="Description" rows={8} />);
    expect(screen.getByRole('textbox')).toHaveAttribute('rows', '8');
  });
});
