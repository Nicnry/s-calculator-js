"use client";

import { User } from "@/app/types/user";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { deleteUser } from "@/app/services/userService";

export default function UserList({ users }: { users: User[] }) {
  const router = useRouter();

  const handleDelete = async (userId: number | undefined) => {
    if (confirm("Voulez-vous supprimer cet utilisateur ?")) {
      await deleteUser(userId);
      router.refresh();
    }
  };

  return (
    <ul className="space-y-2">
      {users.length === 0 ? (
        <p>Aucun utilisateur trouvé.</p>
      ) : (
        users.map((user) => (
          <li key={user.id} className="border p-3 rounded-md shadow flex justify-between items-center">
            <div>
              <p className="font-semibold">{user.name}</p>
              <p className="text-gray-500">{user.email}</p>
            </div>
            <div className="flex gap-2">
              <Link href={`/users/${user.id}`} className="text-blue-500 hover:underline">
                Voir détails
              </Link>
              <Link href={`/users/${user.id}/edit`} className="text-yellow-500 hover:underline">
                Modifier
              </Link>
              <button onClick={() => handleDelete(user.id)} className="text-red-500 hover:underline">
                Supprimer
              </button>
            </div>
          </li>
        ))
      )}
    </ul>
  );
}
