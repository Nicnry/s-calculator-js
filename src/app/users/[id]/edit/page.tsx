/* import UserForm from "@/app/components/UserForm";
import { getUserById } from "@/app/services/userService";

export default async function EditUserPage({ params }: { params: { id: number } }) {
  const user = await getUserById(params.id);

  if (!user) {
    return <p>Utilisateur non trouvé</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Modifier l'utilisateur</h1>
      <UserForm user={user} />
    </div>
  );
}
 */
export default function EditUserPage() {}