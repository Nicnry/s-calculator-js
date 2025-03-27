'use client';

import { ReactNode } from 'react';
import { Salary } from '@/app/db/schema';
import { SalariesContext } from '@/app/contexts/SalariesContext';

export function SalariesProvider({ salaries, children }: SalariesProviderProps) {
  return (
    <SalariesContext.Provider value={{ salaries }}>
      {children}
    </SalariesContext.Provider>
  );
}

type SalariesProviderProps = {
  salaries: Salary[] | [];
  children: ReactNode;
}