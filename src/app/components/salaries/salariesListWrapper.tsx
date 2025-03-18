'use client';

import { Suspense, useEffect, useState } from 'react';
import React from 'react';
import { Salary } from '@/app/db/schema';
import { SalaryService } from '@/app/services/salaryService';
import SalariesList from '@/app/components/salaries/salariesList';
import BackLink from '@/app/components/global/BackLink';
import CreateNew from '@/app/components/global/CreateNew';

export default function SalariesListWrapper({ userId }: {userId: number}) {
  const [salaries, setSalaries] = useState<Salary[]>([]);

  useEffect(() => {
    (async () => {
      setSalaries(await SalaryService.getAllSalaries());
    })();
  }, []);

  const handleDeleteAccount = (deletedId: number) => {
    setSalaries((prevSalaries) => prevSalaries.filter((salary) => salary.id !== deletedId));
  };
  
  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <BackLink href={`/users`} />
        <h1 className="text-3xl font-bold mb-6">Gestion des salaires</h1>
        <CreateNew href="salaries/new" title="+ Créer un salaire" />
      </div>
      <div className="bg-white shadow-lg rounded-xl overflow-hidden">
        <div className="divide-y divide-gray-100">
          <Suspense fallback={<SalaryListSkeleton />}>
            {salaries.map((salary) => (
              <SalariesList 
                key={salary.id} 
                id={salary.id} 
                userId={userId}
                totalSalary={salary.totalSalary} 
                avsAiApgContribution={salary.avsAiApgContribution}
                vdLpcfamDeduction={salary.vdLpcfamDeduction}
                acDeduction={salary.acDeduction}
                aanpDeduction={salary.aanpDeduction}
                ijmA1Deduction={salary.ijmA1Deduction}
                lppDeduction={salary.lppDeduction}
                onDelete={handleDeleteAccount} 
              />
            ))}
          </Suspense>
      </div>
    </div>
  </>
  );
};

function SalaryListSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-48 mb-4"></div>
      {[1, 2, 3].map((_, index) => (
        <div 
          key={index} 
          className="h-16 bg-gray-100 rounded mb-2"
        ></div>
      ))}
    </div>
  );
}
