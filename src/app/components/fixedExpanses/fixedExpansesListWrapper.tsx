'use client';

import { Suspense, useEffect, useState } from 'react';
import React from 'react';
import { FixedExpense } from '@/app/db/schema';
import ExpansesList from '@/app/components/fixedExpanses/expanseList';
import BackLink from '@/app/components/global/BackLink';
import CreateNew from '@/app/components/global/CreateNew';
import FixedExpanseService from '@/app/services/fixedExpanseService';

export default function FixedExpansesListWrapper({ userId }: { userId: number }) {
  const [expanses, setExpanses] = useState<FixedExpense[]>([]);

  useEffect(() => {
    (async () => {
      setExpanses(await FixedExpanseService.getAllUserExpanses(userId))
    })();
  }, [userId]);

  const handleDeleteExpanse = (deletedId: number) => {
    setExpanses((prevExpanse) => prevExpanse.filter((expanse) => expanse.id !== deletedId));
  };
  
  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <BackLink />
        <h1 className="text-3xl font-bold mb-6">Gestion des charges</h1>
        <CreateNew href="fixedExpenses/new" title="+ Ajouter une charge" />
      </div>
      <div className="bg-white shadow-lg rounded-xl overflow-hidden">
        <div className="divide-y divide-gray-100">
          <Suspense fallback={<UserListSkeleton />}>
          {expanses.map((expanse) => (
              <ExpansesList 
                key={expanse.id!}
                expanse={expanse}
                onDelete={handleDeleteExpanse} />
            ))}
          </Suspense>
        </div>
      </div>
    </>
    );
};

function UserListSkeleton() {
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