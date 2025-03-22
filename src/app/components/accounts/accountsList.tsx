import React from 'react';
import AccountsItem from '@/app/components/accounts/accountsItem';
import { BankAccount } from '@/app/db/schema';

export default function UserList({ account, onDelete }: { account: BankAccount, onDelete: (id: number) => void; }) {

  return (<AccountsItem key={account.id} account={account} onDelete={onDelete} />);
};