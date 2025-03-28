'use client';

import { ReactNode } from 'react';
import { User } from '@/app/db/schema';
import { UserContext } from '@/app/contexts/UserContext';

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