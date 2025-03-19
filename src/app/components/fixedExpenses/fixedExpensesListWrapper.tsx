'use client';

import { Suspense, useEffect, useState } from 'react';
import React from 'react';
import { FixedExpense } from '@/app/db/schema';
import ExpensesList from '@/app/components/fixedExpenses/expenseList';
import BackLink from '@/app/components/global/BackLink';
import CreateNew from '@/app/components/global/CreateNew';
import FixedExpenseService from '@/app/services/fixedExpenseService';
import { DollarSign, Calendar, CreditCard } from 'lucide-react';

export default function FixedExpensesListWrapper({ userId }: { userId: number }) {
  const [expenses, setExpenses] = useState<FixedExpense[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const data = await FixedExpenseService.getAllUserExpenses(userId);
      setExpenses(data);
      setLoading(false);
    })();
  }, [userId]);

  const handleDeleteExpense = (deletedId: number) => {
    setExpenses((prevExpense) => prevExpense.filter((expense) => expense.id !== deletedId));
  };
  
  // Calculer les totaux des charges
  const calculateTotals = () => {
    if (expenses.length === 0) return { total: 0, monthly: 0, annual: 0 };
    
    let totalAmount = 0;
    let monthlyAmount = 0;
    let annualAmount = 0;
    
    expenses.forEach(expense => {
      const amount = expense.amount;
      
      // Calculer le total général
      totalAmount += amount;
      
      // Calculer les montants en fonction de la récurrence
      switch(expense.recurrence) {
        case 'quotidienne':
          monthlyAmount += amount * 30; // approximation pour un mois
          annualAmount += amount * 365;
          break;
        case 'hebdomadaire':
          monthlyAmount += amount * 4.33; // approximation pour un mois (52/12)
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
          // Les charges ponctuelles sont comptées dans le total mais pas dans les récurrences
          break;
      }
    });
    
    return {
      total: totalAmount,
      monthly: monthlyAmount,
      annual: annualAmount
    };
  };
  
  const totals = calculateTotals();
  
  // Formater les montants pour l'affichage
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('fr-CH', { 
      style: 'currency', 
      currency: 'CHF',
      minimumFractionDigits: 2
    }).format(amount);
  };
  
  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <BackLink />
        <h1 className="text-3xl font-bold">Gestion des charges</h1>
        <CreateNew href="fixed-expenses/new" title="+ Ajouter une charge" />
      </div>
      
      {/* Résumé des charges */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
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
      
      {/* Liste des charges */}
      <div className="bg-white shadow-lg rounded-xl overflow-hidden">
        {loading ? (
          <UserListSkeleton />
        ) : expenses.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-500">Aucune charge fixe n'a été ajoutée.</p>
            <p className="mt-2">
              <a href="fixed-expenses/new" className="text-blue-500 hover:underline">
                Cliquez ici pour ajouter votre première charge
              </a>
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            <Suspense fallback={<UserListSkeleton />}>
              {expenses.map((expense) => (
                <ExpensesList 
                  key={expense.id}
                  expense={expense}
                  onDelete={handleDeleteExpense} 
                />
              ))}
            </Suspense>
          </div>
        )}
      </div>
    </>
  );
};

function UserListSkeleton() {
  return (
    <div className="animate-pulse p-4">
      <div className="h-4 bg-gray-200 rounded w-48 mb-4"></div>
      {[1, 2, 3].map((_, index) => (
        <div 
          key={index} 
          className="h-16 bg-gray-100 rounded mb-2 p-4"
        ></div>
      ))}
    </div>
  );
}