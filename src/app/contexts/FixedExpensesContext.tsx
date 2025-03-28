'use client';

import { createContext, useContext } from 'react';
import { FixedExpense } from '@/app/db/schema';

export const FixedExpensesContext = createContext<FixedExpensesContextType>({ fixedExpenses: [] });

export function useFixedExpenses() {
  const context = useContext(FixedExpensesContext);
  if (!context) {
    throw new Error('useFixedExpenses doit être utilisé à l\'intérieur d\'un FixedExpensesProvider');
  }
  return context;
}

type FixedExpensesContextType = {
  fixedExpenses: FixedExpense[] | [];
}