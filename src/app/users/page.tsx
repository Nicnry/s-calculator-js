import UserList from "@/app/components/UserList";
import { getUsers } from "@/app/services/userService";
import { User } from "@/app/types/user";

export default async function UsersPage() {
  let users: User[] = [];

  try {
    users = await getUsers();
  } catch (error) {
    console.error("Erreur lors du chargement des utilisateurs", error);
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Liste des utilisateurs</h1>
      <UserList users={users} />
    </div>
  );
}
