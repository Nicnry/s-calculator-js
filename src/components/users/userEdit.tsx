'use client';

import UserForm from "@/components/users/userForm";
import { useUser } from "@/contexts/UserContext";

export default function UserEdit() {
  const { user } = useUser();

  return (
    <div className="container mx-auto px-4 py-8">
      {user ? <UserForm user={user} update /> : <p>Chargement...</p>}
    </div>
  );
}