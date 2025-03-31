import React from 'react';
import AccountsItem from '@/components/accounts/accountsItem';
import { BankAccount } from '@/db/schema';

export default function UserList({ account, onDelete }: UserListProps) {

  return (<AccountsItem key={account.id} account={account} onDelete={onDelete} />);
};

interface UserListProps {
  account: BankAccount;
  onDelete: (id: number) => void;
}