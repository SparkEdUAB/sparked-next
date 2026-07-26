import { beforeEach, describe, expect, it, vi } from 'vitest';

const { createUser, deleteUsers, editUser, fetchUsers, findUserByEmail, findUserByName, requireAuth, requireRole } =
  vi.hoisted(() => ({
    createUser: vi.fn(),
    deleteUsers: vi.fn(),
    editUser: vi.fn(),
    fetchUsers: vi.fn(),
    findUserByEmail: vi.fn(),
    findUserByName: vi.fn(),
    requireAuth: vi.fn(),
    requireRole: vi.fn(),
  }));

vi.mock('../create', () => ({ default: createUser }));
vi.mock('../edit', () => ({ default: editUser }));
vi.mock('../delete', () => ({ default: deleteUsers }));
vi.mock('..', () => ({ default: fetchUsers, findUserByEmail_: findUserByEmail, findUserByName_: findUserByName }));
vi.mock('../../lib/auth', () => ({ requireAuth, requireRole }));

import { GET, POST } from './route';

const request = new Request('http://localhost/api/users/fetchUsers') as never;
const params = (slug: string) => ({ params: Promise.resolve({ slug }) });
const session = { user: { id: 'admin-1', role: 'Admin', organizationId: 'organization-1' } } as never;
const context = {
  userId: 'admin-1',
  role: 'Admin',
  organizationId: 'organization-1',
  isPlatformAdmin: false,
  session,
};

describe('users API authorization', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    createUser.mockResolvedValue(new Response('{}'));
    fetchUsers.mockResolvedValue(new Response('{}'));
  });

  it('rejects anonymous requests before selecting a handler', async () => {
    requireAuth.mockResolvedValue(new Response('{}', { status: 401 }));

    expect((await GET(request, params('fetchUsers'))).status).toBe(401);
    expect(fetchUsers).not.toHaveBeenCalled();
  });

  it('rejects ordinary users before selecting a handler', async () => {
    requireAuth.mockResolvedValue(context);
    requireRole.mockReturnValue(new Response('{}', { status: 403 }));

    expect((await POST(request, params('createUser'))).status).toBe(403);
    expect(createUser).not.toHaveBeenCalled();
  });

  it('passes the trusted server session to an authorized handler', async () => {
    requireAuth.mockResolvedValue(context);
    requireRole.mockReturnValue(null);

    expect((await GET(request, params('fetchUsers'))).status).toBe(200);
    expect(fetchUsers).toHaveBeenCalledWith(request, session);
  });
});
