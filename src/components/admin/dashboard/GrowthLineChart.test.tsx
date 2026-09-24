import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { GrowthLineChart } from './GrowthLineChart';

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

  it('explains why growth data is unavailable', () => {
    render(<GrowthLineChart />);
    expect(screen.getByText(/growth data is not available yet/i)).toBeInTheDocument();
    expect(screen.getByText(/historical statistics/i)).toBeInTheDocument();
  });
});
