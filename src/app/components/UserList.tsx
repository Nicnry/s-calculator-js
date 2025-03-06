"use client";

//import { User } from "@/app/types/user";
/* import { useRouter } from "next/navigation";
import { deleteUser } from "@/app/services/userService";
import { useState } from "react";
import UserListItem from "./UserListItem"; */
import { User } from "@/app/db/schema";

interface UserListProps {
  users: User[];
}

export default function UserList({ users }: UserListProps) {
  /* const router = useRouter();
  const [localUsers, setLocalUsers] = useState(users);

  const handleDelete = async (userId: number | undefined) => {
    const confirmDelete = window.confirm("Voulez-vous vraiment supprimer cet utilisateur ?");
    
    if (confirmDelete) {
      try {
        await deleteUser(userId);
        setLocalUsers(currentUsers => 
          currentUsers.filter(user => user.id !== userId)
        );
        router.refresh();
      } catch (error) {
        console.error("Erreur lors de la suppression", error);
        alert("Impossible de supprimer l'utilisateur");
      }
    }
  }; */
  console.log(users);

  return (
    <div className="bg-white shadow-lg rounded-xl overflow-hidden">
      {/* {localUsers.length === 0 ? (
        <div className="p-6 text-center text-gray-500 bg-gray-50">
          <p className="text-lg font-medium">Aucun utilisateur trouvé</p>
          <p className="text-sm">Commencez par ajouter un nouvel utilisateur</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-100">
          {localUsers.map((user) => (
            <UserListItem 
              key={user.id} 
              user={user} 
              onDelete={() => handleDelete(user.id)}
            />
          ))}
        </div>
      )} */}
    </div>
  );
}