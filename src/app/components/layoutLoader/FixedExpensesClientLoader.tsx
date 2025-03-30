'use client';

import { useState, useEffect } from 'react';
import { getDataSource } from '@/app/lib/data-layer';
import { FixedExpensesProvider } from "@/app/providers/FixedExpensesProvider";
import { FixedExpense } from '@/app/db/schema';

export function FixedExpensesClientLoader({ children, userId }: FixedExpensesClientLoaderProps) {
  const [fixedExpenses, setFixedExpenses] = useState<FixedExpense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadFixedExpenses() {
      try {
        setLoading(true);
        const dataSource = getDataSource('indexeddb');
        const data = await dataSource.getAllUserFixedExpenses(userId);
        setFixedExpenses(data);
      } catch (error) {
        console.error('Erreur lors du chargement des salaires:', error);
        setError("Impossible de charger les données. Veuillez réessayer plus tard.");
      } finally {
        setLoading(false);
      }
    }
    
    loadFixedExpenses();
  }, [userId]);

  if (loading) {
    return <div className="flex justify-center items-center p-4">Chargement des données...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

  return (
    <FixedExpensesProvider initialFixedExpenses={fixedExpenses}>
      {children}
    </FixedExpensesProvider>
  );
}

type FixedExpensesClientLoaderProps = {
  children: React.ReactNode;
  userId: number;
}