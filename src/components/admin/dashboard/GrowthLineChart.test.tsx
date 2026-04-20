import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { GrowthLineChart } from './GrowthLineChart';

vi.mock('recharts', () => ({
  LineChart: ({ children }: any) => <div data-testid="line-chart">{children}</div>,
  Line: () => null,
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

describe('GrowthLineChart', () => {
  it('renders the chart title', () => {
    render(<GrowthLineChart />);
    expect(screen.getByText('Growth Over Time')).toBeInTheDocument();
  });

  it('renders the stub overlay message', () => {
    render(<GrowthLineChart />);
    expect(screen.getByText(/time-series data not available/i)).toBeInTheDocument();
  });

  it('renders the line chart element', () => {
    render(<GrowthLineChart />);
    expect(screen.getByTestId('line-chart')).toBeInTheDocument();
  });
});
