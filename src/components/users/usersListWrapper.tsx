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
      <div className="flex justify-between items-center mb-6">
        <BackLink />
        <h1 className="text-3xl font-bold mb-6">Gestion des Utilisateurs</h1>
        <CreateNew href="users/new" title="+ Créer un utilisateur" />
      </div>
      <div className="bg-white shadow-lg rounded-xl overflow-hidden">
        <div className="divide-y divide-gray-100">
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
      </div>
    </>
    );
};