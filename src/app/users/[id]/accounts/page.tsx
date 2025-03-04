import AccountList from "@/app/components/AccountList";
import AccountForm from "@/app/components/AccountForm";
import { getUserById } from "@/app/services/userService";

export default async function UserAccountsPage({ params }: { params: { id: string } }) {
  const userId = parseInt(params.id);

  const user = await getUserById(userId);

  if (!user) {
    return <p>Utilisateur non trouvé</p>;
  }

  return (
    <div>
      <h1>Comptes de l'utilisateur {userId}</h1>
      <AccountForm userId={userId} />
      <AccountList userId={userId} />
    </div>
  );
}
