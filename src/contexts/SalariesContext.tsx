'use client';

import { createContext, useContext } from 'react';
import { Salary } from '@/db/schema';

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
  setSalaries?: React.Dispatch<React.SetStateAction<Salary[]>>;
  addSalary?: (account: Salary) => Promise<Salary>;
  removeSalary?: (id: number) => Promise<boolean>;
  updateSalary?: (account: Salary) => Promise<Salary>;
}