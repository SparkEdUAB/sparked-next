import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import i18next from 'i18next';
import { StatsCard } from './StatsCard';

vi.mock('@/components/ui/card', () => ({
  Card: ({ children, ...props }: any) => <div data-testid="card" {...props}>{children}</div>,
  CardContent: ({ children, ...props }: any) => <div {...props}>{children}</div>,
}));

vi.mock('@/components/ui/badge', () => ({
  Badge: ({ children, ...props }: any) => <span data-testid="badge" {...props}>{children}</span>,
}));

describe('StatsCard', () => {
  it('renders entity name and value', () => {
    render(<StatsCard name="users" value={42} />);
    expect(screen.getByText('users')).toBeInTheDocument();
    expect(screen.getByText('42')).toBeInTheDocument();
  });

  it('renders percentage value with % sign', () => {
    render(<StatsCard name="completion_rate" value={85} isPercentage />);
    expect(screen.getByText('85')).toBeInTheDocument();
    expect(screen.getByText('%')).toBeInTheDocument();
  });

  it('renders trend badge when percentageTrend is provided', () => {
    render(<StatsCard name="users" value={42} percentageTrend="up" />);
    expect(screen.getByTestId('badge')).toBeInTheDocument();
    expect(screen.getByTestId('badge')).toHaveTextContent('up');
  });

  it('renders no badge when percentageTrend is absent', () => {
    render(<StatsCard name="users" value={42} />);
    expect(screen.queryByTestId('badge')).not.toBeInTheDocument();
  });

  it('translates entity name via i18next', () => {
    const spy = vi.spyOn(i18next, 't').mockReturnValue('Translated');
    render(<StatsCard name="users" value={42} />);
    expect(spy).toHaveBeenCalledWith('users');
    expect(screen.getByText('Translated')).toBeInTheDocument();
    spy.mockRestore();
  });
});
