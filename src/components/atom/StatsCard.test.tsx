import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DashbordUsageCard } from './StatsCard';

vi.mock('flowbite-react', () => ({
  Card: ({ children, ...props }: any) => <div data-testid="card" {...props}>{children}</div>,
}));

vi.mock('@components/layouts/adminLayout/links', () => ({
  ADMIN_LINKS: {
    users: { link: '/admin/users' },
  },
}));

describe('DashbordUsageCard', () => {
  it('renders name and value', () => {
    render(<DashbordUsageCard name="users" value={42} />);
    expect(screen.getByText('users')).toBeInTheDocument();
    expect(screen.getByText('42')).toBeInTheDocument();
  });

  it('shows % suffix when isPercentage is true', () => {
    render(<DashbordUsageCard name="growth" value={75} isPercentage />);
    expect(screen.getByText('%')).toBeInTheDocument();
  });

  it('returns null when isPercentage and value is 0', () => {
    const { container } = render(<DashbordUsageCard name="growth" value={0} isPercentage />);
    expect(container.innerHTML).toBe('');
  });

  it('renders trend arrow for down', () => {
    render(<DashbordUsageCard name="users" value={10} percentageTrend="down" />);
    expect(screen.getByText(/down ↓/)).toBeInTheDocument();
  });

  it('renders trend arrow for up', () => {
    render(<DashbordUsageCard name="users" value={10} percentageTrend="up" />);
    expect(screen.getByText(/up ↑/)).toBeInTheDocument();
  });

  it('shows "Add" link when hasLink and value is 0', () => {
    render(<DashbordUsageCard name="users" value={0} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/admin/users');
    expect(link.textContent).toContain('Add');
  });
});
