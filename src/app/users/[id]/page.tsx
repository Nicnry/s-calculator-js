/* import Link from "next/link";

import { getUserById } from "@/app/services/userService";

export default async function UserDetail({ params }: { params: { id: string } }) {
  const user = await getUserById(parseInt(params.id));

  if (!user) return <p>Utilisateur non trouvé</p>;

  return (
    <div>
      <h1>{user.name}</h1>
      <p>Email: {user.email}</p>

      <Link href={`/users/${user.id}/salaries`}>Voir les salaires</Link>
    </div>
  );
} */
export default function UserDetail() {}