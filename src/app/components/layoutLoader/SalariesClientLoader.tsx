'use client';

import { useState, useEffect } from 'react';
import { getDataSource } from '@/app/lib/data-layer';
import { SalariesProvider } from "@/app/providers/SalariesProvider";
import { Salary } from '@/app/db/schema';

export function SalariesClientLoader({ children, userId }: SalariesClientLoaderProps) {
  const [salaries, setSalaries] = useState<Salary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadSalaries() {
      try {
        setLoading(true);
        const dataSource = getDataSource('indexeddb');
        const data = await dataSource.getAllUserSalaries(userId);
        setSalaries(data);
      } catch (error) {
        console.error('Erreur lors du chargement des salaires:', error);
        setError("Impossible de charger les données. Veuillez réessayer plus tard.");
      } finally {
        setLoading(false);
      }
    }
    
    loadSalaries();
  }, [userId]);

  if (loading) {
    return <div className="flex justify-center items-center p-4">Chargement des données...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

  return (
    <SalariesProvider initialSalaries={salaries}>
      {children}
    </SalariesProvider>
  );
}

type SalariesClientLoaderProps = {
  children: React.ReactNode;
  userId: number;
}