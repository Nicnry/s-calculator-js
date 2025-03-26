'use client';

import { ReactNode } from 'react';
import { User } from '@/app/db/schema';
import { UserContext } from '@/app/contexts/UserContext';

interface UserProviderProps {
  user: User | null;
  children: ReactNode;
}

export function UserProvider({ user, children }: UserProviderProps) {
  return (
    <UserContext.Provider value={{ user }}>
      {children}
    </UserContext.Provider>
  );
}