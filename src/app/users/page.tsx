import { Suspense } from 'react';
import UserList from "@/app/components/UserList";
import { getUsers } from "@/app/services/userService";
import Link from "next/link";

function UsersPageLayout() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">

        <h1 className="text-3xl font-bold mb-6">Gestion des Utilisateurs</h1>
        <Link 
          href={`/users/new`} 
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          title="+ Créer un utilisateur"
        >+ Créer un utilisateur</Link>
      </div>
      <Suspense fallback={<UserListSkeleton />}>
        <UserListWrapper />
      </Suspense>
    </div>
  );
}

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

async function UserListWrapper() {
  const users = await getUsers();
  return <UserList users={users} />;
}

export const dynamic = "force-dynamic";
export default UsersPageLayout;