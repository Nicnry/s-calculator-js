'use client';

import UserForm from "@/app/components/users/userForm";
import { useUser } from "@/app/contexts/UserContext";

export default function UserEdit() {
  const { user } = useUser();

  return (
    <div>
      {user ? <UserForm user={user} update /> : <p>Chargement...</p>}
    </div>
  );
}