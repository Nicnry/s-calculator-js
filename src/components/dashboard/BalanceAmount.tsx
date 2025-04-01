"use client"

import { useFixedExpenses } from '@/contexts/FixedExpensesContext';
import { useSalaries } from '@/contexts/SalariesContext';
import React, { useMemo } from 'react';
import { SalaryModel } from '@/models/SalaryModel';
import { getCurrentDate, getFirstDayOfMonth, getLastDayOfMonth, getMonthName } from '@/utils/dateUtils';

export function BalanceAmount() {
  const { salaries } = useSalaries();
  const { fixedExpenses } = useFixedExpenses();
  
  const { balance, isPositive, currentMonth } = useMemo(() => {
    const today = getCurrentDate();
    const firstOfTheMonth = getFirstDayOfMonth(today);
    const lastOfTheMonth = getLastDayOfMonth(today);
    const currentMonth = getMonthName(today);
    
    const currentSalaries = salaries
      ? salaries
        .map(salary => new SalaryModel(salary))
        .filter(salary => {
          const fromDate = new Date(salary.from);
          const toDate = salary.to ? new Date(salary.to) : new Date(9999, 11, 31);
          return fromDate <= lastOfTheMonth && toDate >= firstOfTheMonth;
        })
      : [];
    
    const currentExpenses = fixedExpenses
      ? fixedExpenses.filter(expense => {
          const fromDate = new Date(expense.from);
          const toDate = expense.to ? new Date(expense.to) : new Date(9999, 11, 31);
          return fromDate <= lastOfTheMonth && toDate >= firstOfTheMonth;
        })
      : [];
    
    // Calculer le total des salaires nets
    const salaryTotal = currentSalaries.reduce((total, salaryModel) => {
      return total + salaryModel.getNetSalary();
    }, 0);
    
    // Calculer le total des dépenses pour le mois en cours
    const expenseTotal = currentExpenses.reduce((total, expense) => {
      // Pour les dépenses mensuelles, prendre le montant entier
      if (expense.recurrence === "mensuelle") {
        return total + expense.amount;
      }
      
      // Pour les autres récurrences, vérifier si la date de la dépense est dans le mois courant
      const expenseDate = new Date(expense.date);
      if (expenseDate.getMonth() === today.getMonth() && 
          expenseDate.getFullYear() === today.getFullYear()) {
        return total + expense.amount;
      }
      
      return total;
    }, 0);
    
    // Calculer le solde disponible
    const calculatedBalance = salaryTotal - expenseTotal;
    
    return {
      balance: calculatedBalance,
      isPositive: calculatedBalance >= 0,
      firstOfTheMonth,
      lastOfTheMonth,
      currentMonth
    };
  }, [salaries, fixedExpenses]);
  
  return (
    <>
      <div className="flex items-center gap-3">
        <div className="bg-blue-100 p-3 rounded-full">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <p className="text-gray-500 text-sm">Solde disponible - {currentMonth}</p>
          <p className={`text-2xl font-bold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {isPositive ? '+' : ''}{balance.toFixed(2)} CHF
          </p>
        </div>
      </div>
      
      <div className="w-full sm:w-auto">
        <div className={`px-4 py-2 rounded-lg ${isPositive ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
          {isPositive 
            ? 'Votre budget est équilibré ce mois-ci' 
            : 'Attention : budget négatif ce mois-ci'}
        </div>
      </div>
    </>
  );
}