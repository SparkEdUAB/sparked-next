import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AdminSidebar } from './AdminSidebar';

// usePathname already mocked in vitest.setup.tsx to return '/'
vi.mock('@/components/ui/scroll-area', () => ({
  ScrollArea: ({ children }: any) => <div>{children}</div>,
}));

describe('AdminSidebar', () => {
  const toggleSidebar = vi.fn();

  it('renders all nav group labels when expanded', () => {
    render(<AdminSidebar collapsed={false} toggleSidebar={toggleSidebar} />);
    expect(screen.getByText('Overview')).toBeInTheDocument();
    expect(screen.getByText('Content')).toBeInTheDocument();
    expect(screen.getByText('Management')).toBeInTheDocument();
    expect(screen.getByText('Media')).toBeInTheDocument();
    expect(screen.getByText('System')).toBeInTheDocument();
  });

  it('renders all nav item labels when expanded', () => {
    render(<AdminSidebar collapsed={false} toggleSidebar={toggleSidebar} />);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Grades')).toBeInTheDocument();
    expect(screen.getByText('Subjects')).toBeInTheDocument();
    expect(screen.getByText('Units')).toBeInTheDocument();
    expect(screen.getByText('Topics')).toBeInTheDocument();
    expect(screen.getByText('Users')).toBeInTheDocument();
    expect(screen.getByText('Institutions')).toBeInTheDocument();
    expect(screen.getByText('Media Content')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('hides group labels when collapsed', () => {
    render(<AdminSidebar collapsed={true} toggleSidebar={toggleSidebar} />);
    expect(screen.queryByText('Overview')).not.toBeInTheDocument();
    expect(screen.queryByText('Dashboard')).not.toBeInTheDocument();
  });

  it('calls toggleSidebar when collapse button is clicked', () => {
    render(<AdminSidebar collapsed={false} toggleSidebar={toggleSidebar} />);
    fireEvent.click(screen.getByRole('button', { name: /collapse/i }));
    expect(toggleSidebar).toHaveBeenCalled();
  });

  it('shows mobile overlay when not collapsed', () => {
    render(<AdminSidebar collapsed={false} toggleSidebar={toggleSidebar} />);
    const overlay = document.querySelector('[aria-hidden="true"]');
    expect(overlay).toBeInTheDocument();
  });
});
