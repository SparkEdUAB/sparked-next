import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AdminShell } from './AdminShell';

vi.mock('./AdminSidebar', () => ({
  AdminSidebar: ({ collapsed }: any) => (
    <aside data-testid="sidebar" data-collapsed={String(collapsed)} />
  ),
}));

vi.mock('./AdminTopbar', () => ({
  AdminTopbar: () => <header data-testid="topbar" />,
}));

vi.mock('./AdminBreadcrumb', () => ({
  AdminBreadcrumb: () => <nav data-testid="breadcrumb" />,
}));

describe('AdminShell', () => {
  it('renders topbar', () => {
    render(<AdminShell><div>content</div></AdminShell>);
    expect(screen.getByTestId('topbar')).toBeInTheDocument();
  });

  it('renders sidebar', () => {
    render(<AdminShell><div>content</div></AdminShell>);
    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
  });

  it('renders children', () => {
    render(<AdminShell><div>page content</div></AdminShell>);
    expect(screen.getByText('page content')).toBeInTheDocument();
  });

  it('renders breadcrumb', () => {
    render(<AdminShell><div>content</div></AdminShell>);
    expect(screen.getByTestId('breadcrumb')).toBeInTheDocument();
  });

  it('starts with sidebar collapsed', () => {
    render(<AdminShell><div>content</div></AdminShell>);
    expect(screen.getByTestId('sidebar')).toHaveAttribute('data-collapsed', 'true');
  });
});
