import React from 'react';
import ExpenseItem from '@/components/fixedExpenses/expenseItem';
import { FixedExpense } from '@/db/schema';

export default function ExpenseList({ expense, onDelete }: ExpenseListProps) {

  return (<ExpenseItem key={expense.id} expense={expense} onDelete={onDelete} />);
};

interface ExpenseListProps {
  expense: FixedExpense;
  onDelete: (id: number) => void;
}