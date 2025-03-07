'use client';

import { Suspense, useEffect, useState } from 'react';
import React from 'react';
import { Salary } from '@/app/db/schema';
import { SalaryService } from '@/app/services/salaryService';
import Link from 'next/link';
import SalariesList from '@/app/components/salaries/salariesList';

export default function SalariesListWrapper() {
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

        <h1 className="text-3xl font-bold mb-6">Gestion des salaires</h1>
        <Link 
          href={`salaries/new`} 
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          title="+ Créer un compte"
        >+ Créer un salaire</Link>
      </div>
      <div className="bg-white shadow-lg rounded-xl overflow-hidden">
        <div className="divide-y divide-gray-100">
        <Suspense fallback={<SalaryListSkeleton />}>
        {salaries.map((salary) => (
            <SalariesList 
              key={salary.id} 
              id={salary.id!} 
              userId={1}
              totalSalary={salary.totalSalary} 
              avsAiApgContribution={salary.avsAiApgContribution}
              vdLpcfamDeduction={salary.vdLpcfamDeduction}
              acDeduction={salary.acDeduction}
              aanpDeduction={salary.aanpDeduction}
              ijmA1Deduction={salary.ijmA1Deduction}
              lppDeduction={salary.lppDeduction}
              onDelete={handleDeleteAccount} />
          ))}
        </Suspense>
      </div>
    </div>
    <div>
      <Link href="/users/">Retour aux utilisateurs</Link>
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