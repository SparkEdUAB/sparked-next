import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AdminFormInput } from './AdminFormInput';

vi.mock('flowbite-react', () => ({
  Label: ({ children, ...props }: any) => <label {...props}>{children}</label>,
  TextInput: (props: any) => <input {...props} />,
}));

vi.mock('@components/atom', () => ({
  RedAsterisk: () => <span data-testid="red-asterisk">*</span>,
}));

describe('AdminFormInput', () => {
  it('renders label text', () => {
    render(<AdminFormInput disabled={false} name="title" label="Title" />);
    expect(screen.getByText('Title')).toBeInTheDocument();
  });

  it('sets name and id attributes on input', () => {
    render(<AdminFormInput disabled={false} name="title" label="Title" />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('name', 'title');
    expect(input).toHaveAttribute('id', 'title');
  });

  it('shows red asterisk when required', () => {
    render(<AdminFormInput disabled={false} name="title" label="Title" required />);
    expect(screen.getByTestId('red-asterisk')).toBeInTheDocument();
  });

  it('does not show asterisk when not required', () => {
    render(<AdminFormInput disabled={false} name="title" label="Title" />);
    expect(screen.queryByTestId('red-asterisk')).toBeNull();
  });

  it('passes disabled state', () => {
    render(<AdminFormInput disabled={true} name="title" label="Title" />);
    expect(screen.getByRole('textbox')).toBeDisabled();
  });

  it('calls onChange handler', () => {
    const onChange = vi.fn();
    render(<AdminFormInput disabled={false} name="title" label="Title" onChange={onChange} />);
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'test' } });
    expect(onChange).toHaveBeenCalled();
  });
});
