import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { EntityBarChart } from './EntityBarChart';

// Recharts uses ResizeObserver and canvas - mock the chart
vi.mock('recharts', () => ({
  BarChart: ({ children }: any) => <div data-testid="bar-chart">{children}</div>,
  Bar: () => null,
  XAxis: () => null,
  YAxis: () => null,
  CartesianGrid: () => null,
  Tooltip: () => null,
  ResponsiveContainer: ({ children }: any) => <div>{children}</div>,
}));

vi.mock('@/components/ui/card', () => ({
  Card: ({ children }: any) => <div>{children}</div>,
  CardContent: ({ children }: any) => <div>{children}</div>,
  CardHeader: ({ children }: any) => <div>{children}</div>,
  CardTitle: ({ children }: any) => <h2>{children}</h2>,
}));

const STATS = [
  { index: 1, name: 'users', value: 10, isPercentage: false },
  { index: 2, name: 'grades', value: 5, isPercentage: false },
  { index: 3, name: 'completion', value: 80, isPercentage: true },
];

describe('EntityBarChart', () => {
  it('renders the chart title', () => {
    render(<EntityBarChart stats={STATS} />);
    expect(screen.getByText('Content Overview')).toBeInTheDocument();
  });

  it('renders the bar chart', () => {
    render(<EntityBarChart stats={STATS} />);
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
  });

  it('returns null when all values are zero or percentage', () => {
    const emptyStats = [{ index: 1, name: 'users', value: 0, isPercentage: false }];
    const { container } = render(<EntityBarChart stats={emptyStats} />);
    expect(container.firstChild).toBeNull();
  });
});
