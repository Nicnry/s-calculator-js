import React from 'react';
import UsersItem from '@/app/components/users/usersItem';

export default function UserList({ id, name, email, onDelete }: UserListProps) {
  return (<UsersItem id={id} name={name} email={email} onDelete={onDelete} />);
};

interface UserListProps {
  id: number;
  name: string;
  email: string;
  onDelete: (id: number) => void;
};