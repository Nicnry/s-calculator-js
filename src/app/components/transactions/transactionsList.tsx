import React from 'react';
import TransactionsItem from '@/app/components/transactions/transactionsItem';

export default function TransactionsList({ id, userId, totalSalary, avsAiApgContribution, vdLpcfamDeduction, acDeduction, aanpDeduction, ijmA1Deduction, lppDeduction, onDelete }:   { id: number, userId: number, totalSalary: number, avsAiApgContribution: number, vdLpcfamDeduction: number, acDeduction: number, aanpDeduction: number, ijmA1Deduction: number, lppDeduction: number, onDelete: (id: number) => void; }) {
  
  return (<TransactionsItem id={id} userId={userId} totalSalary={totalSalary} avsAiApgContribution={avsAiApgContribution} vdLpcfamDeduction={vdLpcfamDeduction} acDeduction={acDeduction} aanpDeduction={aanpDeduction} ijmA1Deduction={ijmA1Deduction} lppDeduction={lppDeduction} onDelete={onDelete} />);
};