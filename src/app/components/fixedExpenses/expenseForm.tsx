'use client'

import FixedExpenseService from "@/app/services/fixedExpenseService";
import { FixedExpense, FixedExpenseCreate, defaultFixedExpense } from "@/app/db/schema";
import FormComponent from "@/app/components/global/FormComponent";
import { fixedExpenseFormFields } from "@/app/components/fixedExpenses/fixedExpenseFormFields";

export default function ExpenseForm({ 
  userId, 
  expense, 
  update = false 
}: { 
  userId: number, 
  expense?: FixedExpenseCreate | FixedExpense | undefined, 
  update?: boolean 
}) {
  const initialData = {...defaultFixedExpense(), ...expense, userId};

  const onSubmit = async (data: typeof initialData) => {
    const now = new Date();
    
    const submissionData = {
      userId: userId,
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
      await FixedExpenseService.addFixedExpense(submissionData);
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