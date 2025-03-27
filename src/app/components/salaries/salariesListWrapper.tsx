'use client';

import { useEffect, useState } from 'react';
import { Salary } from '@/app/db/schema';
import SalaryService from '@/app/services/salaryService';
import SalariesList from '@/app/components/salaries/salariesList';
import GenericListWrapper from '@/app/components/global/GenericListWrapper';
import { useUser } from '@/app/contexts/UserContext';

export default function SalariesListWrapper() {
  const [salaries, setSalaries] = useState<Salary[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();

  useEffect(() => {
    (async () => {
      setLoading(true);
      const data = await SalaryService.getAllUserSalaries(user!.id!);
      setSalaries(data);
      setLoading(false);
    })();
  }, [user]);

  const handleDeleteSalary = (deletedId: number) => {
    setSalaries((prevSalaries) => prevSalaries.filter((salary) => salary.id !== deletedId));
  };
  
  return (
    <GenericListWrapper
      title="Gestion des salaires"
      createNewHref="salaries/new"
      createNewTitle="+ Créer un salaire"
      items={salaries}
      isLoading={loading}
      renderItem={(salary) => (
        <SalariesList
          key={salary.id}
          salary={salary}
          onDelete={handleDeleteSalary}
        />
      )}
      onDelete={handleDeleteSalary}
      emptyMessage="Aucun salaire trouvé. Créez votre premier salaire."
    />
  );
}