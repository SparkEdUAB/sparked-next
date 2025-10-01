'use client'; 
import { T_UserFields } from 'types/user';
import { create } from 'zustand';
import { persist  } from 'zustand/middleware';

export type User = {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    role: 'student' | 'user' | 'admin';
    isAdmin: boolean;
};

type Mestore = {
    user: User | null;
    setUser: (user: User) => void;
    clearUser: () => void;  
    
}

export const useMeStore = create<Mestore>()(
    persist(
        (set) => (
            {
                user: null, 
                setUser: (user: User) => set({ user }), 
                clearUser: () => set({user: null})
            }
        ), 
        {
            name: 'me-section', 
            // getStorage: () => sessionStorage,
        }
    )
)