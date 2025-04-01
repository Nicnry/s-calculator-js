import React from 'react';
import { SalaryDashboard } from '@/components/dashboard/SalaryDashboard';
import { FixedExpensesDashboard } from '@/components/dashboard/FixedExpensesDashboard';
import { BalanceDashboard } from '@/components/dashboard/BalanceDashboard';

export default function SalaryList() {
  const today = new Date();
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard du mois de {today.toLocaleDateString('fr-FR', {
        month: 'long'
      })}</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-1">
          <SalaryDashboard />
        </div>
        
        <div className="md:col-span-1">
          <FixedExpensesDashboard />
        </div>
        
        <div className="md:col-span-2">
          <BalanceDashboard />
        </div>
      </div>
    </div>
  );
}