import React from 'react';
import ExpenseItem from '@/app/components/fixedExpenses/expenseItem';
import { FixedExpense } from '@/app/db/schema';

export default function ExpenseList({ expense, onDelete }: { expense: FixedExpense, onDelete: (id: number) => void; }) {

  return (<ExpenseItem key={expense.id} expense={expense} onDelete={onDelete} />);
};