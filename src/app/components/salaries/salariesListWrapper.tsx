'use client';

import { Suspense, useEffect, useState } from 'react';
import React from 'react';
import { Salary } from '@/app/db/schema';
import { SalaryService } from '@/app/services/salaryService';
import SalariesList from '@/app/components/salaries/salariesList';

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
      <Suspense fallback={<SalaryListSkeleton />}>
        {salaries.map((salary) => (
          <SalariesList 
            key={salary.id} 
            id={salary.id!} 
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
