'use client';

import { createContext, useContext } from 'react';
import { Salary } from '@/app/db/schema';

export const SalariesContext = createContext<SalariesContextType>({ salaries: [] });

export function useSalaries() {
  const context = useContext(SalariesContext);
  if (!context) {
    throw new Error('useSalaries doit être utilisé à l\'intérieur d\'un SalariesProvider');
  }
  return context;
}

type SalariesContextType = {
  salaries: Salary[] | [];
}