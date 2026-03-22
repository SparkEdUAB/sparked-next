import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RelatedMediaContentList } from './RelatedMediaContentList';

vi.mock('flowbite-react', () => {
  const List = ({ children, ...props }: any) => <ul {...props}>{children}</ul>;
  List.Item = ({ children, ...props }: any) => <li {...props}>{children}</li>;
  return { List };
});

const mockItems = [
  {
    _id: '1',
    name: 'Test Media 1',
    description: 'Description 1',
    thumbnail_url: 'https://example.com/thumb1.jpg',
    external_url: 'https://example.com/video1',
  },
  {
    _id: '2',
    name: 'Test Media 2',
    description: 'Description 2',
    thumbnail_url: 'invalid-url',
    external_url: null,
  },
];

describe('RelatedMediaContentList', () => {
  it('renders heading and items when non-empty', () => {
    render(<RelatedMediaContentList relatedMediaContent={mockItems as any} />);
    expect(screen.getByText('Related Media')).toBeInTheDocument();
    expect(screen.getByText('Test Media 1')).toBeInTheDocument();
    expect(screen.getByText('Test Media 2')).toBeInTheDocument();
  });

  it('renders correct links', () => {
    render(<RelatedMediaContentList relatedMediaContent={mockItems as any} />);
    const links = screen.getAllByRole('link');
    expect(links[0]).toHaveAttribute('href', '/library/media/1');
    expect(links[1]).toHaveAttribute('href', '/library/media/2');
  });

  it('renders nothing for null', () => {
    const { container } = render(<RelatedMediaContentList relatedMediaContent={null} />);
    expect(container.querySelector('h3')).toBeNull();
  });

  it('renders nothing for empty array', () => {
    const { container } = render(<RelatedMediaContentList relatedMediaContent={[]} />);
    expect(container.querySelector('h3')).toBeNull();
  });
});
