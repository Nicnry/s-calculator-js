import { Suspense, useEffect, useState } from 'react';
import React from 'react';
import UsersList from '@/components/users/usersList';
import { User } from '@/db/schema';
import { UserService } from '@/services/userService';
import CreateNew from '@/components/global/CreateNew';
import BackLink from '@/components/global/BackLink';
import ListSkeleton from '@/components/global/ListSkeleton';

export default function UserListWrapper() {
  const [users, setUsers] = useState<User[]>([]);


  useEffect(() => {
    (async () => setUsers(await UserService.getAllUsers()))();
  }, []);

  const handleDeleteUser = (deletedId: number) => {
    setUsers((prevUsers) => prevUsers.filter((user) => user.id !== deletedId));
  };

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between md:items-center mb-14 gap-4">
        <BackLink />
        <h1 className="text-3xl font-bold mb-6 md:mb-0">Gestion des Utilisateurs</h1>
        <CreateNew href="users/new" title="+ Créer un utilisateur" />
      </div>
        <div className="grid gap-6">
          <Suspense fallback={<ListSkeleton />}>
            {users.map((user) => (
              <UsersList 
                key={user.id} 
                id={user.id!} 
                name={user.name} 
                email={user.email} 
                onDelete={handleDeleteUser} />
            ))}
          </Suspense>
      </div>
    </>
    );
};