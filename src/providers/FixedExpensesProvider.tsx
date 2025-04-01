'use client';

import { ReactNode, useState } from 'react';
import { FixedExpense, FixedExpenseTimeStamps } from '@/db/schema';
import { FixedExpensesContext } from '@/contexts/FixedExpensesContext';
import FixedExpenseService from '@/services/fixedExpenseService';

export function FixedExpensesProvider({ initialFixedExpenses, children }: FixedExpensesProviderProps) {
  const [fixedExpenses, setFixedExpenses] = useState<FixedExpense[]>(initialFixedExpenses || []);
  
    const addFixedExpense = async (fixedExpense: FixedExpenseTimeStamps) => {
      try {
        await FixedExpenseService.addFixedExpense(fixedExpense);
        const savedFixedExpense: FixedExpenseTimeStamps = fixedExpense;
        setFixedExpenses((prevSalaries: FixedExpense[]) => {
          return [...prevSalaries, savedFixedExpense] as FixedExpense[];
        });
        
        return savedFixedExpense;
      } catch (error) {
        console.error("Erreur lors de l'ajout du compte:", error);
        throw error;
      }
    };
  
    const removeFixedExpense = async (id: number) => {
      try {
        await FixedExpenseService.deleteExpense(id);
        setFixedExpenses(prevSalaries => prevSalaries.filter(account => account.id !== id));
        return true;
      } catch (error) {
        console.error("Erreur lors de la suppression du compte:", error);
        throw error;
      }
    };
  
    const updateFixedExpense = async (updatedFixedExpense: FixedExpense) => {
      try {
        await FixedExpenseService.updateFixedExpense(updatedFixedExpense.id!, updatedFixedExpense);
        setFixedExpenses(prevSalaries => 
          prevSalaries.map(account => 
            account.id === updatedFixedExpense.id ? updatedFixedExpense : account
          )
        );
        return updatedFixedExpense;
      } catch (error) {
        console.error("Erreur lors de la mise à jour du compte:", error);
        throw error;
      }
    };

  return (
    <FixedExpensesContext.Provider value={{ 
      fixedExpenses,
      setFixedExpenses,
      addFixedExpense,
      removeFixedExpense,
      updateFixedExpense }}>
      {children}
    </FixedExpensesContext.Provider>
  );
}

type FixedExpensesProviderProps = {
  initialFixedExpenses: FixedExpense[] | [];
  children: ReactNode;
}