import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LibraryErrorMessage } from './LibraryErrorMessage';

vi.mock('react-icons/io', () => ({
  IoIosCloseCircleOutline: (props: any) => <span data-testid="error-icon" {...props} />,
}));

describe('LibraryErrorMessage', () => {
  it('renders children text', () => {
    render(<LibraryErrorMessage>Something went wrong</LibraryErrorMessage>);
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  it('renders error icon', () => {
    render(<LibraryErrorMessage>Error</LibraryErrorMessage>);
    expect(screen.getByTestId('error-icon')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<LibraryErrorMessage className="custom-class">Error</LibraryErrorMessage>);
    expect(container.firstChild).toHaveClass('custom-class');
  });
});
