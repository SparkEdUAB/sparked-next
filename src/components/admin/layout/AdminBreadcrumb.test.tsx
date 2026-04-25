import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AdminBreadcrumb } from './AdminBreadcrumb';

vi.mock('@hooks/useNavigation', () => ({
  default: () => ({
    generateBreadcrumbItems: () => [
      { link: '/admin', label: 'Admin' },
      { link: '/admin/grades', label: 'Grades' },
    ],
    activeMenuItem: { link: '/admin/grades' },
  }),
}));

vi.mock('@/components/ui/breadcrumb', () => ({
  Breadcrumb: ({ children }: any) => <nav aria-label="breadcrumb">{children}</nav>,
  BreadcrumbList: ({ children }: any) => <ol>{children}</ol>,
  BreadcrumbItem: ({ children }: any) => <li>{children}</li>,
  BreadcrumbLink: ({ children, href }: any) => <a href={href}>{children}</a>,
  BreadcrumbPage: ({ children }: any) => <span aria-current="page">{children}</span>,
  BreadcrumbSeparator: () => <span>/</span>,
}));

describe('AdminBreadcrumb', () => {
  it('renders breadcrumb items', () => {
    render(<AdminBreadcrumb />);
    expect(screen.getByText('Admin')).toBeInTheDocument();
    expect(screen.getByText('Grades')).toBeInTheDocument();
  });

  it('renders last item as current page', () => {
    render(<AdminBreadcrumb />);
    expect(screen.getByText('Grades').closest('[aria-current="page"]')).toBeInTheDocument();
  });

  it('renders first item as a link', () => {
    render(<AdminBreadcrumb />);
    expect(screen.getByRole('link', { name: 'Admin' })).toHaveAttribute('href', '/admin');
  });
});
