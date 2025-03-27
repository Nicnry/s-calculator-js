import React from 'react';
import AccountsItem from '@/app/components/accounts/accountsItem';
import { BankAccount } from '@/app/db/schema';

export default function UserList({ account, onDelete }: UserListProps) {

  return (<AccountsItem key={account.id} account={account} onDelete={onDelete} />);
};

interface UserListProps {
  account: BankAccount;
  onDelete: (id: number) => void;
}