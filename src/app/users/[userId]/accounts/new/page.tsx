import AccountForm from "@/app/components/accounts/accountForm";

export default async function NewAccountPage({ params, }: { params: Promise<{ userId: string }> }) {

  const { userId } = await params;
  const id = Number(userId);

  if (isNaN(id)) return <p>ID invalide</p>;
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Créer un compte pour le user {id}</h1>
      <AccountForm userId={id} />
    </div>
  );
}
