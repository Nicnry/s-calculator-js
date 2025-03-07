import AccountForm from "@/app/components/accounts/accountForm";

export default async function NewAccountPage({ params, }: { params: Promise<{ id: string }> }) {

  const { id } = await params;
  const userId = Number(id);

  if (isNaN(userId)) return <p>ID invalide</p>;
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Créer un utilisateur{userId}</h1>
      <AccountForm />
    </div>
  );
}
