// src/app/users/page.tsx
import { Suspense } from 'react';
import UserList from "@/app/components/UserList";
import { getUsers } from "@/app/services/userService";

// Composant statique de mise en page
function UsersPageLayout() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Gestion des Utilisateurs</h1>
      <Suspense fallback={<UserListSkeleton />}>
        <UserListWrapper />
      </Suspense>
    </div>
  );
}

// Composant de chargement pendant le fetch
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

// Wrapper pour le chargement des utilisateurs
async function UserListWrapper() {
  const users = await getUsers();
  return <UserList users={users} />;
}

// Utilisation du revalidate pour mise à jour périodique
export const revalidate = 60; // Revalide toutes les 60 secondes

export default UsersPageLayout;