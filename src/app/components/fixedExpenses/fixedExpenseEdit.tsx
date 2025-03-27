'use client';

import { FixedExpense } from "@/app/db/schema";
import { useState, useEffect } from "react";
import ExpenseForm from "@/app/components/fixedExpenses/expenseForm";
import FixedExpenseService from "@/app/services/fixedExpenseService";
import { useUser } from "@/app/contexts/UserContext";

type FixedExpenseEditProps = {
  fixedExpenseId: number;
};

export default function FixedExpenseEdit({ fixedExpenseId }: FixedExpenseEditProps) {
  const { user } = useUser();
  const [fixedExpense, setFixedExpense] = useState<FixedExpense>();
  
  useEffect(() => {
    (async () => {
      setFixedExpense(await FixedExpenseService.getUserFixedExpenseById(fixedExpenseId));
    })();
  }, [fixedExpenseId]);  

  return (
    <div>
      {fixedExpense ? <ExpenseForm userId={user!.id!} expense={fixedExpense} update /> : <p>Chargement...</p>}
    </div>
  );
}