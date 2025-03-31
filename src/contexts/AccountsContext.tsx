'use client';

import { createContext, useContext } from 'react';
import { BankAccount } from '@/db/schema';

export const AccountsContext = createContext<AccountsContextType>({ accounts: [] });

export function useAccounts() {
  const context = useContext(AccountsContext);
  if (!context) {
    throw new Error('useAccounts doit être utilisé à l\'intérieur d\'un AccountsProvider');
  }
  return context;
}

type AccountsContextType = {
  accounts: BankAccount[] | [];
  setAccounts?: React.Dispatch<React.SetStateAction<BankAccount[]>>;
  addAccount?: (account: BankAccount) => Promise<BankAccount>;
  removeAccount?: (id: number) => Promise<boolean>;
  updateAccount?: (account: BankAccount) => Promise<BankAccount>;
}