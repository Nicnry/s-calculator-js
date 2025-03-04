import AccountList from "@/app/components/AccountList";
import AccountForm from "@/app/components/AccountForm";

export default function UserAccountsPage({ params }: { params: { id: string } }) {
  const userId = parseInt(params.id);

  return (
    <div>
      <h1>Comptes de l'utilisateur {userId}</h1>
      <AccountForm userId={userId} />
      <AccountList userId={userId} />
    </div>
  );
}
