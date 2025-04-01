'use client';

import { createContext, useContext } from 'react';
import { User } from '@/db/schema';

export const UserContext = createContext<UserContextType>({ user: undefined });

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser doit être utilisé à l\'intérieur d\'un UserProvider');
  }
  return context;
}

type UserContextType = {
  user: User | undefined;
}