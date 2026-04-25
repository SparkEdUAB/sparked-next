import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AdminTopbar } from './AdminTopbar';

vi.mock('./ThemeToggle', () => ({ ThemeToggle: () => <button>theme</button> }));
vi.mock('./UserDropdown', () => ({ UserDropdown: () => <div>user</div> }));
vi.mock('@components/logo', () => ({ default: () => <span>Logo</span> }));
vi.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, ...props }: any) => (
    <button onClick={onClick} {...props}>{children}</button>
  ),
}));

describe('AdminTopbar', () => {
  const toggleSidebar = vi.fn();

  it('renders the logo', () => {
    render(<AdminTopbar sidebarCollapsed={true} toggleSidebar={toggleSidebar} />);
    expect(screen.getByText('Logo')).toBeInTheDocument();
  });

  it('renders sidebar toggle button', () => {
    render(<AdminTopbar sidebarCollapsed={true} toggleSidebar={toggleSidebar} />);
    expect(screen.getByRole('button', { name: /toggle sidebar/i })).toBeInTheDocument();
  });

  it('calls toggleSidebar when toggle button is clicked', () => {
    render(<AdminTopbar sidebarCollapsed={true} toggleSidebar={toggleSidebar} />);
    fireEvent.click(screen.getByRole('button', { name: /toggle sidebar/i }));
    expect(toggleSidebar).toHaveBeenCalled();
  });

  it('renders ThemeToggle and UserDropdown', () => {
    render(<AdminTopbar sidebarCollapsed={true} toggleSidebar={toggleSidebar} />);
    expect(screen.getByText('theme')).toBeInTheDocument();
    expect(screen.getByText('user')).toBeInTheDocument();
  });
});
