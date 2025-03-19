'use client';

import { FixedExpense, User } from "@/app/db/schema";
import { UserService } from "@/app/services/userService";
import { useState, useEffect } from "react";
import ExpenseForm from "@/app/components/fixedExpenses/expenseForm";
import FixedExpenseService from "@/app/services/fixedExpenseService";

export default function FixedExpenseEdit({ userId, fixedExpenseId }: { userId: number; fixedExpenseId: number }) {
  const [user, setUser] = useState<User>();
  const [fixedExpense, setFixedExpense] = useState<FixedExpense>();
  
  useEffect(() => {
    (async () => {
      setUser(await UserService.getUserById(userId));
      setFixedExpense(await FixedExpenseService.getUserFixedExpenseById(/* userId,  */fixedExpenseId));
    })();
  }, [userId, fixedExpenseId]);  

  return (
    <div>
      {user && fixedExpense ? <ExpenseForm userId={user.id!} expense={fixedExpense} update /> : <p>Chargement...</p>}
    </div>
  );
}