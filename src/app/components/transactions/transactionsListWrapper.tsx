'use client';

import { Suspense, useEffect, useState } from 'react';
import React from 'react';
import { Salary } from '@/app/db/schema';
import { SalaryService } from '@/app/services/salaryService';
import TransactionsList from '@/app/components/transactions/transactionsList';

export default function TransactionsListWrapper() {
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
          <TransactionsList 
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
