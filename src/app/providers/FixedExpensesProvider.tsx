'use client';

import { ReactNode } from 'react';
import { FixedExpense } from '@/app/db/schema';
import { FixedExpensesContext } from '@/app/contexts/FixedExpensesContext';

export function FixedExpensesProvider({ fixedExpenses, children }: FixedExpensesProviderProps) {
  return (
    <FixedExpensesContext.Provider value={{ fixedExpenses }}>
      {children}
    </FixedExpensesContext.Provider>
  );
}

type FixedExpensesProviderProps = {
  fixedExpenses: FixedExpense[] | [];
  children: ReactNode;
}