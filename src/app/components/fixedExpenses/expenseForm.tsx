'use client'

import FixedExpenseService from "@/app/services/fixedExpenseService";
import { FixedExpense, FixedExpenseCreate, defaultFixedExpense } from "@/app/db/schema";
import FormComponent from "@/app/components/global/FormComponent";
import { fixedExpenseFormFields } from "@/app/components/fixedExpenses/fixedExpenseFormFields";
import { useUser } from "@/app/contexts/UserContext";
import { useFixedExpenses } from "@/app/contexts/FixedExpensesContext";

type FixedExpenseFormProps = {
  expense?: FixedExpenseCreate | FixedExpense;
  update?: boolean;
}

export default function ExpenseForm({ expense, update = false }: FixedExpenseFormProps) {
  const { user } = useUser();
  const { addFixedExpense } = useFixedExpenses();
  const initialData = {...defaultFixedExpense(), ...expense, userId: user!.id!};

  const onSubmit = async (data: typeof initialData) => {
    const now = new Date();
    
    const submissionData = {
      userId: user!.id!,
      title: data.title,
      amount: Number(data.amount),
      category: data.category,
      date: data.date,
      recurrence: data.recurrence,
      paid: Boolean(data.paid),
      paymentMethod: data.paymentMethod,
      createdAt: now,
      updatedAt: now,
      from: data.from || now,
      to: data.to || null
    };

    if (update) {
      if (expense && 'id' in expense) {
        await FixedExpenseService.updateFixedExpense(expense.id, submissionData);
      } else {
        throw new Error("Expense must have an 'id' to be updated.");
      }
    } else {
      if (addFixedExpense) {
        await addFixedExpense(submissionData);
      } else {
        console.warn("La fonction addFixedExpense n'est pas disponible dans le contexte");
      }
    }
  };

  return (
    <FormComponent 
      initialData={initialData} 
      fields={fixedExpenseFormFields} 
      onSubmit={onSubmit}  
      title={update ? "Modifier la charge" : "Créer une charge"} 
    />
  );
}