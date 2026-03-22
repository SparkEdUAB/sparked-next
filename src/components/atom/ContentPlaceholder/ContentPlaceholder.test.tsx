import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ContentPlaceholder from './ContentPlaceholder';

describe('ContentPlaceholder', () => {
  it('renders the message prop', () => {
    render(<ContentPlaceholder message="No items found" />);
    expect(screen.getByText('No items found')).toBeInTheDocument();
  });

  it('applies className to container', () => {
    const { container } = render(<ContentPlaceholder message="test" className="my-class" />);
    expect(container.firstChild).toHaveClass('my-class');
  });

  it('applies textClassName to paragraph', () => {
    render(<ContentPlaceholder message="test" textClassName="text-bold" />);
    expect(screen.getByText('test')).toHaveClass('text-bold');
  });
});
