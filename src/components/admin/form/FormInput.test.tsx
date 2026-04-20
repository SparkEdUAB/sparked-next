import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { FormInput } from './FormInput';

vi.mock('@/components/ui/input', () => ({
  Input: ({ id, name, placeholder, onChange, disabled, ...props }: any) => (
    <input id={id} name={name} placeholder={placeholder} onChange={onChange} disabled={disabled} {...props} />
  ),
}));
vi.mock('@/components/ui/label', () => ({
  Label: ({ children, htmlFor }: any) => <label htmlFor={htmlFor}>{children}</label>,
}));
vi.mock('@components/atom', () => ({ RedAsterisk: () => <span>*</span> }));

describe('FormInput', () => {
  it('renders label and input', () => {
    render(<FormInput disabled={false} name="title" label="Title" />);
    expect(screen.getByLabelText('Title')).toBeInTheDocument();
  });

  it('shows asterisk when required', () => {
    render(<FormInput disabled={false} name="title" label="Title" required />);
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('passes defaultValue to input', () => {
    render(<FormInput disabled={false} name="title" label="Title" defaultValue="hello" />);
    expect(screen.getByDisplayValue('hello')).toBeInTheDocument();
  });

  it('calls onChange when input changes', () => {
    const onChange = vi.fn();
    render(<FormInput disabled={false} name="title" label="Title" onChange={onChange} />);
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'test' } });
    expect(onChange).toHaveBeenCalled();
  });
});
