'use client';

import { ReactNode, useState } from 'react';
import { Salary } from '@/db/schema';
import { SalariesContext } from '@/contexts/SalariesContext';
import SalaryService from '@/services/salaryService';

export function SalariesProvider({ initialSalaries, children }: SalariesProviderProps) {
  const [salaries, setSalaries] = useState<Salary[]>(initialSalaries || []);

  const addSalary = async (salary: Salary) => {
    try {
      await SalaryService.addSalary(salary);
      const savedSalary: Salary = salary;
      setSalaries((prevSalaries: Salary[]) => {
        return [...prevSalaries, savedSalary] as Salary[];
      });
      
      return savedSalary;
    } catch (error) {
      console.error("Erreur lors de l'ajout du compte:", error);
      throw error;
    }
  };

  const removeSalary = async (id: number) => {
    try {
      await SalaryService.deleteSalary(id);
      setSalaries(prevSalaries => prevSalaries.filter(account => account.id !== id));
      return true;
    } catch (error) {
      console.error("Erreur lors de la suppression du compte:", error);
      throw error;
    }
  };

  const updateSalary = async (updatedSalary: Salary) => {
    try {
      await SalaryService.updateSalary(updatedSalary.id!, updatedSalary);
      setSalaries(prevSalaries => 
        prevSalaries.map(account => 
          account.id === updatedSalary.id ? updatedSalary : account
        )
      );
      return updatedSalary;
    } catch (error) {
      console.error("Erreur lors de la mise à jour du compte:", error);
      throw error;
    }
  };

  return (
    <SalariesContext.Provider value={{
      salaries,
      setSalaries,
      addSalary,
      removeSalary,
      updateSalary
      }}>
      {children}
    </SalariesContext.Provider>
  );
}

type SalariesProviderProps = {
  initialSalaries: Salary[] | [];
  children: ReactNode;
}