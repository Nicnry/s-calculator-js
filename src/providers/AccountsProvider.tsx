'use client';

import { ReactNode, useState } from 'react';
import { BankAccount } from '@/db/schema';
import { AccountsContext } from '@/contexts/AccountsContext';
import { UserAccountService } from '@/services/userAccountService';

export function AccountsProvider({ initialAccounts, children }: AccountsProviderProps) {
  const [accounts, setAccounts] = useState<BankAccount[]>(initialAccounts || []);

  const addAccount = async (account: BankAccount) => {
    try {
      await UserAccountService.addAccount(account);
      const savedAccount: BankAccount = account;
      setAccounts((prevAccounts: BankAccount[]) => {
        return [...prevAccounts, savedAccount] as BankAccount[];
      });
      
      return savedAccount;
    } catch (error) {
      console.error("Erreur lors de l'ajout du compte:", error);
      throw error;
    }
  };

  const removeAccount = async (id: number) => {
    try {
      await UserAccountService.deleteAccount(id);
      setAccounts(prevAccounts => prevAccounts.filter(account => account.id !== id));
      return true;
    } catch (error) {
      console.error("Erreur lors de la suppression du compte:", error);
      throw error;
    }
  };

  const updateAccount = async (updatedAccount: BankAccount) => {
    try {
      await UserAccountService.updateAccount(updatedAccount.id!, updatedAccount);
      setAccounts(prevAccounts => 
        prevAccounts.map(account => 
          account.id === updatedAccount.id ? updatedAccount : account
        )
      );
      return updatedAccount;
    } catch (error) {
      console.error("Erreur lors de la mise à jour du compte:", error);
      throw error;
    }
  };

  return (
    <AccountsContext.Provider value={{ 
      accounts, 
      setAccounts,
      addAccount,
      removeAccount,
      updateAccount
    }}>
      {children}
    </AccountsContext.Provider>
  );
}

type AccountsProviderProps = {
  initialAccounts: BankAccount[] | [];
  children: ReactNode;
}