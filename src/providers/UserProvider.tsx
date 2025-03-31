'use client';

import { ReactNode } from 'react';
import { User } from '@/db/schema';
import { UserContext } from '@/contexts/UserContext';

export function UserProvider({ user, children }: UserProviderProps) {
  return (
    <UserContext.Provider value={{ user }}>
      {children}
    </UserContext.Provider>
  );
}

type UserProviderProps = {
  user: User | undefined;
  children: ReactNode;
}