import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { UserDropdown } from './UserDropdown';

const mockHandleLogout = vi.fn();

vi.mock('@hooks/useAuth', () => ({
  default: () => ({ handleLogout: mockHandleLogout }),
}));

vi.mock('@stores/useMeStore', () => ({
  useFullName: () => 'Jane Doe',
  useUser: () => ({ email: 'jane@example.com' }),
}));

// shadcn DropdownMenu uses Radix portals — render into document.body
vi.mock('@/components/ui/dropdown-menu', () => ({
  DropdownMenu: ({ children }: any) => <div>{children}</div>,
  DropdownMenuTrigger: ({ children }: any) => <div>{children}</div>,
  DropdownMenuContent: ({ children }: any) => <div data-testid="dropdown-content">{children}</div>,
  DropdownMenuItem: ({ children, onClick }: any) => <button onClick={onClick}>{children}</button>,
  DropdownMenuSeparator: () => <hr />,
}));

vi.mock('@/components/ui/avatar', () => ({
  Avatar: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  AvatarFallback: ({ children }: any) => <span data-testid="avatar-fallback">{children}</span>,
}));

describe('UserDropdown', () => {
  it('renders avatar with correct initials', () => {
    render(<UserDropdown />);
    expect(screen.getByTestId('avatar-fallback')).toHaveTextContent('JD');
  });

  it('shows user name and email', () => {
    render(<UserDropdown />);
    expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    expect(screen.getByText('jane@example.com')).toBeInTheDocument();
  });

  it('calls handleLogout when logout is clicked', () => {
    render(<UserDropdown />);
    fireEvent.click(screen.getByText('Logout'));
    expect(mockHandleLogout).toHaveBeenCalled();
  });
});
