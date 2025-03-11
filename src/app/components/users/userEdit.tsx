'use client';

import { User } from "@/app/db/schema";
import { UserService } from "@/app/services/userService";
import { useState, useEffect } from "react";
import UserForm from "@/app/components/users/userForm";

export default function UserEdit({ id }: { id: number; }) {
  const [user, setUser] = useState<User>();
  
  useEffect(() => {
    (async () => setUser(await UserService.getUserById(id)))();
  }, [id]);

  return (
    <div>
      {user ? <UserForm user={user} update /> : <p>Chargement...</p>}
    </div>
  );
}