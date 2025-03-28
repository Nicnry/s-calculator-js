'use client';

import { useState, useEffect } from 'react';
import { getDataSource } from '@/app/lib/data-layer';
import { AccountsProvider } from "@/app/providers/AccountsProvider";
import { BankAccount } from '@/app/db/schema';

export function AccountsClientLoader({ children, userId }: AccountsClientLoaderProps) {
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadAccounts() {
      try {
        setLoading(true);
        const dataSource = getDataSource('indexeddb');
        const data = await dataSource.getAllUserAccounts(userId);
        setAccounts(data);
      } catch (error) {
        console.error('Erreur lors du chargement des salaires:', error);
        setError("Impossible de charger les données. Veuillez réessayer plus tard.");
      } finally {
        setLoading(false);
      }
    }
    
    loadAccounts();
  }, [userId]);

  if (loading) {
    return <div className="flex justify-center items-center p-4">Chargement des données...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

  return (
    <AccountsProvider accounts={accounts}>
      {children}
    </AccountsProvider>
  );
}

type AccountsClientLoaderProps = {
  children: React.ReactNode;
  userId: number;
}