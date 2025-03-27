'use client';

import { useEffect, useState } from 'react';
import { FixedExpense } from '@/app/db/schema';
import ExpensesList from '@/app/components/fixedExpenses/expenseList';
import FixedExpenseService from '@/app/services/fixedExpenseService';
import { DollarSign, Calendar, CreditCard } from 'lucide-react';
import GenericListWrapper from '@/app/components/global/GenericListWrapper';
import { useUser } from '@/app/contexts/UserContext';

export default function FixedExpensesListWrapper() {
  const [expenses, setExpenses] = useState<FixedExpense[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();

  useEffect(() => {
    (async () => {
      setLoading(true);
      const data = await FixedExpenseService.getAllUserExpenses(user!.id!);
      setExpenses(data);
      setLoading(false);
    })();
  }, [user]);

  const handleDeleteExpense = (deletedId: number) => {
    setExpenses((prevExpense) => prevExpense.filter((expense) => expense.id !== deletedId));
  };
  
  const calculateTotals = () => {
    if (expenses.length === 0) return { total: 0, monthly: 0, annual: 0 };
    
    let totalAmount = 0;
    let monthlyAmount = 0;
    let annualAmount = 0;
    
    expenses.forEach(expense => {
      const amount = expense.amount;
      totalAmount += amount;
      
      switch(expense.recurrence) {
        case 'quotidienne':
          monthlyAmount += amount * 30;
          annualAmount += amount * 365;
          break;
        case 'hebdomadaire':
          monthlyAmount += amount * 4.33;
          annualAmount += amount * 52;
          break;
        case 'mensuelle':
          monthlyAmount += amount;
          annualAmount += amount * 12;
          break;
        case 'annuelle':
          monthlyAmount += amount / 12;
          annualAmount += amount;
          break;
        case 'ponctuelle':
          break;
      }
    });
    
    return { total: totalAmount, monthly: monthlyAmount, annual: annualAmount };
  };
  
  const totals = calculateTotals();
  
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('fr-CH', { 
      style: 'currency', 
      currency: 'CHF',
      minimumFractionDigits: 2
    }).format(amount);
  };
  
  const StatsComponent = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-white shadow-md rounded-lg p-4 border-l-4 border-blue-500">
        <div className="flex items-center">
          <div className="rounded-full bg-blue-100 p-3 mr-4">
            <DollarSign size={24} className="text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total des charges</p>
            <p className="text-2xl font-bold">{formatAmount(totals.total)}</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white shadow-md rounded-lg p-4 border-l-4 border-green-500">
        <div className="flex items-center">
          <div className="rounded-full bg-green-100 p-3 mr-4">
            <Calendar size={24} className="text-green-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Charges mensuelles</p>
            <p className="text-2xl font-bold">{formatAmount(totals.monthly)}</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white shadow-md rounded-lg p-4 border-l-4 border-purple-500">
        <div className="flex items-center">
          <div className="rounded-full bg-purple-100 p-3 mr-4">
            <CreditCard size={24} className="text-purple-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Charges annuelles</p>
            <p className="text-2xl font-bold">{formatAmount(totals.annual)}</p>
          </div>
        </div>
      </div>
    </div>
  );
  
  return (
    <GenericListWrapper
      title="Gestion des charges"
      createNewHref="fixed-expenses/new"
      createNewTitle="+ Ajouter une charge"
      items={expenses}
      isLoading={loading}
      renderItem={(expense) => (
        <ExpensesList
          key={expense.id}
          expense={expense}
          onDelete={handleDeleteExpense}
        />
      )}
      onDelete={handleDeleteExpense}
      emptyMessage="Aucune charge fixe n'a été ajoutée."
      statsComponent={<StatsComponent />}
    />
  );
}