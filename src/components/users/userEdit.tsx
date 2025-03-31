'use client';

import UserForm from "@/components/users/userForm";
import { useUser } from "@/contexts/UserContext";

export default function UserEdit() {
  const { user } = useUser();

  return (
    <div>
      {user ? <UserForm user={user} update /> : <p>Chargement...</p>}
    </div>
  );
}