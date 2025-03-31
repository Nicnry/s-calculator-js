'use client';

import { useState, useEffect } from 'react';
import { getDataSource } from '@/lib/data-layer';
import { User } from '@/db/schema';
import { UserProvider } from '@/providers/UserProvider';

export function UserClientLoader({ children, userId }: SalariesClientLoaderProps) {
  const [user, setUser] = useState<User>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadUser() {
      try {
        setLoading(true);
        const dataSource = getDataSource('indexeddb');
        const data = await dataSource.getUser(userId);
        setUser(data);
      } catch (error) {
        console.error('Erreur lors du chargement des salaires:', error);
        setError("Impossible de charger les données. Veuillez réessayer plus tard.");
      } finally {
        setLoading(false);
      }
    }
    
    loadUser();
  }, [userId]);

  if (loading) {
    return <div className="flex justify-center items-center p-4">Chargement des données...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

  return (
    <UserProvider user={user}>
      {children}
    </UserProvider>
  );
}

type SalariesClientLoaderProps = {
  children: React.ReactNode;
  userId: number;
}