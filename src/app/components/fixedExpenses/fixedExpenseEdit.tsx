'use client';

import { FixedExpense } from "@/app/db/schema";
import { useState, useEffect } from "react";
import ExpenseForm from "@/app/components/fixedExpenses/expenseForm";
import FixedExpenseService from "@/app/services/fixedExpenseService";

export default function FixedExpenseEdit({ fixedExpenseId }: FixedExpenseEditProps) {
  const [fixedExpense, setFixedExpense] = useState<FixedExpense>();
  
  useEffect(() => {
    (async () => {
      setFixedExpense(await FixedExpenseService.getUserFixedExpenseById(fixedExpenseId));
    })();
  }, [fixedExpenseId]);  

  return (
    <div>
      {fixedExpense ? <ExpenseForm expense={fixedExpense} update /> : <p>Chargement...</p>}
    </div>
  );
}

type FixedExpenseEditProps = {
  fixedExpenseId: number;
};