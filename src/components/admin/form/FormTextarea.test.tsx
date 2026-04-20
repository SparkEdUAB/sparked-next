import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FormTextarea } from './FormTextarea';

vi.mock('@/components/ui/textarea', () => ({
  Textarea: ({ id, name, placeholder, rows, ...props }: any) => (
    <textarea id={id} name={name} placeholder={placeholder} rows={rows} {...props} />
  ),
}));
vi.mock('@/components/ui/label', () => ({
  Label: ({ children, htmlFor }: any) => <label htmlFor={htmlFor}>{children}</label>,
}));
vi.mock('@components/atom', () => ({ RedAsterisk: () => <span>*</span> }));

describe('FormTextarea', () => {
  it('renders label and textarea', () => {
    render(<FormTextarea disabled={false} name="bio" label="Bio" />);
    expect(screen.getByLabelText('Bio')).toBeInTheDocument();
  });

  it('passes rows prop to textarea', () => {
    render(<FormTextarea disabled={false} name="bio" label="Bio" rows={5} />);
    expect(screen.getByRole('textbox')).toHaveAttribute('rows', '5');
  });
});
