import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RecentActivityTable } from './RecentActivityTable';

vi.mock('@/components/ui/card', () => ({
  Card: ({ children }: any) => <div>{children}</div>,
  CardContent: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  CardHeader: ({ children }: any) => <div>{children}</div>,
  CardTitle: ({ children }: any) => <h2>{children}</h2>,
}));

vi.mock('@/components/ui/table', () => ({
  Table: ({ children }: any) => <table>{children}</table>,
  TableHeader: ({ children }: any) => <thead>{children}</thead>,
  TableBody: ({ children }: any) => <tbody>{children}</tbody>,
  TableRow: ({ children }: any) => <tr>{children}</tr>,
  TableHead: ({ children }: any) => <th>{children}</th>,
  TableCell: ({ children, ...props }: any) => <td {...props}>{children}</td>,
}));

vi.mock('@/components/ui/badge', () => ({
  Badge: ({ children }: any) => <span data-testid="badge">{children}</span>,
}));

const STATS = [
  { index: 1, name: 'users', value: 10, isPercentage: false },
  { index: 2, name: 'grades', value: 0, isPercentage: false },
  { index: 3, name: 'completion', value: 80, isPercentage: true },
];

describe('RecentActivityTable', () => {
  it('renders the section title', () => {
    render(<RecentActivityTable stats={STATS} />);
    expect(screen.getByText('Entity Summary')).toBeInTheDocument();
  });

  it('renders non-percentage stats as rows', () => {
    render(<RecentActivityTable stats={STATS} />);
    expect(screen.getByText('users')).toBeInTheDocument();
    expect(screen.getByText('grades')).toBeInTheDocument();
  });

  it('does not render percentage stats as rows', () => {
    render(<RecentActivityTable stats={STATS} />);
    expect(screen.queryByText('completion')).not.toBeInTheDocument();
  });

  it('shows Active badge for non-zero values', () => {
    render(<RecentActivityTable stats={STATS} />);
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('shows Empty badge for zero values', () => {
    render(<RecentActivityTable stats={STATS} />);
    expect(screen.getByText('Empty')).toBeInTheDocument();
  });

  it('shows no data message when stats is empty', () => {
    render(<RecentActivityTable stats={[]} />);
    expect(screen.getByText('No data available')).toBeInTheDocument();
  });
});
