'use client';

import { ReactNode } from 'react';
import { BankAccount } from '@/app/db/schema';
import { AccountsContext } from '@/app/contexts/AccountsContext';

export function AccountsProvider({ accounts, children }: AccountsProviderProps) {
  return (
    <AccountsContext.Provider value={{ accounts }}>
      {children}
    </AccountsContext.Provider>
  );
}

type AccountsProviderProps = {
  accounts: BankAccount[] | [];
  children: ReactNode;
}