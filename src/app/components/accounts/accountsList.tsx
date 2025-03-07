import React from 'react';
import AccountsItem from '@/app/components/accounts/accountsItem';

export default function UserList({ id, userId, bankName, accountNumber, accountType, balance, currency, onDelete }: { id: number, userId: number, bankName: string, accountNumber: string, accountType: string, balance: number, currency: string, onDelete: (id: number) => void; }) {

  return (<AccountsItem id={id} userId={userId} bankName={bankName} accountNumber={accountNumber} accountType={accountType} balance={balance} currency={currency} onDelete={onDelete} />);
};