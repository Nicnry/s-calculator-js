'use client';

import { useEffect, useState } from 'react';
import { Salary } from '@/app/db/schema';
import SalaryService from '@/app/services/salaryService';
import SalariesList from '@/app/components/salaries/salariesList';
import GenericListWrapper from '@/app/components/global/GenericListWrapper';

export default function SalariesListWrapper({ userId }: { userId: number }) {
  const [salaries, setSalaries] = useState<Salary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const data = await SalaryService.getAllUserSalaries(userId);
      setSalaries(data);
      setLoading(false);
    })();
  }, [userId]);

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