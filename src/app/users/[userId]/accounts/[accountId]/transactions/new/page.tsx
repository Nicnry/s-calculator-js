import AccountTransactionForm from "@/app/components/transactions/accountTransactionForm";

export default async function NewAccountTransactionPage({ params }: NewAccountTransactionPageParams) {

  const { userId, accountId } = await params;
  const id = Number(userId);
  const aId = Number(accountId);

  if (isNaN(id) && isNaN(aId)) return <p>ID invalide</p>;
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Créer une transaction pour le user {id} et le compte {aId}</h1>
      <AccountTransactionForm userId={id} accountId={aId} />
    </div>
  );
}

type NewAccountTransactionPageParams = {
  params: Promise<{ userId: string, accountId: string }>
};