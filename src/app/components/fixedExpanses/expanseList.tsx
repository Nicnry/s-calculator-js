import React from 'react';
import ExpanseItem from '@/app/components/fixedExpanses/expanseItem';
import { FixedExpense } from '@/app/db/schema';

export default function ExpanseList({ expanse, onDelete }: { expanse: FixedExpense, onDelete: (id: number) => void; }) {

  return (<ExpanseItem key={expanse.id} expanse={expanse} onDelete={onDelete} />);
};