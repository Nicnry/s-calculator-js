import React from 'react';
import { BalanceAmount } from '@/components/dashboard/BalanceAmount';

export function BalanceDashboard() {

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Bilan mensuel</h2>
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <BalanceAmount />
      </div>
    </div>
  );
}