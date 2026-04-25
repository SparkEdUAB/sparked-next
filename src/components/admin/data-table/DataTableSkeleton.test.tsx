import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DataTableSkeleton } from './DataTableSkeleton';

vi.mock('@/components/ui/skeleton', () => ({
  Skeleton: ({ className }: any) => <div data-testid="skeleton" className={className} />,
}));
vi.mock('@/components/ui/table', () => ({
  Table: ({ children }: any) => <table>{children}</table>,
  TableHeader: ({ children }: any) => <thead>{children}</thead>,
  TableBody: ({ children }: any) => <tbody>{children}</tbody>,
  TableRow: ({ children }: any) => <tr>{children}</tr>,
  TableHead: ({ children }: any) => <th>{children}</th>,
  TableCell: ({ children }: any) => <td>{children}</td>,
}));

describe('DataTableSkeleton', () => {
  it('renders correct number of skeleton cells', () => {
    render(<DataTableSkeleton columnCount={3} rowCount={2} />);
    // 3 header + (3 * 2) body = 9 skeletons
    expect(screen.getAllByTestId('skeleton')).toHaveLength(9);
  });

  it('uses default rowCount=5 and columnCount=4', () => {
    render(<DataTableSkeleton />);
    // 4 header + (4 * 5) body = 24 skeletons
    expect(screen.getAllByTestId('skeleton')).toHaveLength(24);
  });
});
