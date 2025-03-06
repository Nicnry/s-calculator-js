import { Suspense, useEffect, useState } from 'react';
import React from 'react';
import UsersList from '@/app/components/users/usersList';
import Link from "next/link";
import { User } from '@/app/db/schema';
import { UserService } from '@/app/services/userService';

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

        <h1 className="text-3xl font-bold mb-6">Gestion des Utilisateurs</h1>
        <Link 
          href={`/users/new`} 
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          title="+ Créer un utilisateur"
        >+ Créer un utilisateur</Link>
      </div>
      <div className="bg-white shadow-lg rounded-xl overflow-hidden">
        <div className="divide-y divide-gray-100">
        <Suspense fallback={<UserListSkeleton />}>
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

function UserListSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-48 mb-4"></div>
      {[1, 2, 3].map((_, index) => (
        <div 
          key={index} 
          className="h-16 bg-gray-100 rounded mb-2"
        ></div>
      ))}
    </div>
  );
}