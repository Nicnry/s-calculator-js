import TransactionsListWrapper from "@/app/components/transactions/transactionsListWrapper";

export default async function TransactionsPage({ params }: { params: Promise<{ userId: string, accountId: string }> }) {
  const { userId, accountId } = await params;
  const id = Number(userId);
  const aId = Number(accountId);

  if (isNaN(id)) return <p>ID invalide</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <TransactionsListWrapper userId={id} accountId={aId} />
    </div>
  );
}
