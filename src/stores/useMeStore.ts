'use client'; 
import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';

export type User = {
    id?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    avatar?: string;
    role: {
        name: 'student' | 'user' | 'admin';
    };
    isAdmin: boolean;
};

interface MeStore {
  // State
  user: User | null;
  isLoading: boolean;
  error: string | null;
  _hasHydrated: boolean;
  
  // Actions
  setUser: (user: User | null) => void;
  updateUser: (updates: Partial<User>) => void;
  clearUser: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Computed values
  getFullName: () => string;
  hasRole: (role: string) => boolean;
}

export const useMeStore = create<MeStore>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        user: null,
        isLoading: false,
        error: null,
        _hasHydrated: false,
        
        // Actions
        setUser: (user) => 
          set({ user, error: null }, false, 'setUser'),
          
        updateUser: (updates) => 
          set((state) => ({
            user: state.user ? { ...state.user, ...updates } : null
          }), false, 'updateUser'),
          
        clearUser: () => 
          set({ user: null, error: null }, false, 'clearUser'),
          
        setLoading: (isLoading) => 
          set({ isLoading }, false, 'setLoading'),
          
        setError: (error) => 
          set({ error }, false, 'setError'),
        
        // Computed values
        getFullName: () => {
          const { user } = get();
          if (!user) return '';
          return `${user.firstName || ''} ${user.lastName || ''}`.trim();
        },
        
        hasRole: (role: string) => {
          const { user } = get();
          return user?.role?.name === role || false;
        },
      }),
      {
        name: 'me-store',
        partialize: (state) => ({
          user: state.user,
          _hasHydrated: state._hasHydrated,
        }),
        onRehydrateStorage: () => (state) => {
          if (state) {
            state._hasHydrated = true;
            state.isLoading = false;
            state.error = null;
          }
        },
      }
    ),
    { name: 'MeStore' }
  )
);

// Custom hooks for better DX
export const useUser = () => useMeStore((state) => state.user);
export const useIsAuthenticated = () => useMeStore((state) => !!state.user);
export const useUserLoading = () => useMeStore((state) => state.isLoading);
export const useUserError = () => useMeStore((state) => state.error);

// Individual action hooks to avoid creating new objects
export const useSetUser = () => useMeStore((state) => state.setUser);
export const useUpdateUser = () => useMeStore((state) => state.updateUser);
export const useClearUser = () => useMeStore((state) => state.clearUser);
export const useSetLoading = () => useMeStore((state) => state.setLoading);
export const useSetError = () => useMeStore((state) => state.setError);

export const useFullName = () => useMeStore((state) => state.getFullName());
export const useHasRole = (role: string) => useMeStore((state) => state.hasRole(role));