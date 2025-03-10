import React from 'react';
import TransactionsItem from '@/app/components/transactions/transactionsItem';
import { AccountTransaction } from '@/app/db/schema';

export default function TransactionsList({ id, bankAccountId, amount, type, category, date, description, onDelete }: AccountTransaction & { onDelete: (id: number) => void }) {
  
  return (<TransactionsItem 
          key={id}
          id={id!}
          bankAccountId={bankAccountId}
          amount={amount}
          type={type}
          category={category}
          date={date}
          description={description}
          onDelete={onDelete}
          />
  );
};