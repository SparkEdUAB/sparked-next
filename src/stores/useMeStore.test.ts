import { describe, it, expect, beforeEach } from 'vitest';
import { useMeStore, User } from './useMeStore';

const testUser: User = {
  id: '1',
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  role: 'admin',
  isAdmin: true,
};

describe('useMeStore', () => {
  beforeEach(() => {
    useMeStore.setState({ user: null, isLoading: false, error: null });
  });

  it('has correct initial state', () => {
    const state = useMeStore.getState();
    expect(state.user).toBeNull();
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('setUser sets user and clears error', () => {
    useMeStore.getState().setError('some error');
    useMeStore.getState().setUser(testUser);
    const state = useMeStore.getState();
    expect(state.user).toEqual(testUser);
    expect(state.error).toBeNull();
  });

  it('updateUser merges partial updates', () => {
    useMeStore.getState().setUser(testUser);
    useMeStore.getState().updateUser({ firstName: 'Jane' });
    expect(useMeStore.getState().user?.firstName).toBe('Jane');
    expect(useMeStore.getState().user?.lastName).toBe('Doe');
  });

  it('updateUser does nothing when user is null', () => {
    useMeStore.getState().updateUser({ firstName: 'Jane' });
    expect(useMeStore.getState().user).toBeNull();
  });

  it('clearUser sets user to null and clears error', () => {
    useMeStore.getState().setUser(testUser);
    useMeStore.getState().setError('error');
    useMeStore.getState().clearUser();
    expect(useMeStore.getState().user).toBeNull();
    expect(useMeStore.getState().error).toBeNull();
  });

  it('setLoading updates isLoading', () => {
    useMeStore.getState().setLoading(true);
    expect(useMeStore.getState().isLoading).toBe(true);
  });

  it('setError updates error', () => {
    useMeStore.getState().setError('fail');
    expect(useMeStore.getState().error).toBe('fail');
  });

  describe('getFullName', () => {
    it('returns full name with both names', () => {
      useMeStore.getState().setUser(testUser);
      expect(useMeStore.getState().getFullName()).toBe('John Doe');
    });

    it('returns first name only when no last name', () => {
      useMeStore.getState().setUser({ ...testUser, lastName: undefined });
      expect(useMeStore.getState().getFullName()).toBe('John');
    });

    it('returns empty string when user is null', () => {
      expect(useMeStore.getState().getFullName()).toBe('');
    });
  });

  describe('hasRole', () => {
    it('returns true for matching role', () => {
      useMeStore.getState().setUser(testUser);
      expect(useMeStore.getState().hasRole('admin')).toBe(true);
    });

    it('returns false for non-matching role', () => {
      useMeStore.getState().setUser(testUser);
      expect(useMeStore.getState().hasRole('student')).toBe(false);
    });

    it('returns false when user is null', () => {
      expect(useMeStore.getState().hasRole('admin')).toBe(false);
    });
  });
});
