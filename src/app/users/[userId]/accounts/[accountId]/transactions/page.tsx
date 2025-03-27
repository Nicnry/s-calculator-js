import TransactionsListWrapper from "@/app/components/transactions/transactionsListWrapper";

export default async function TransactionsPage({ params }: { params: Promise<{ accountId: string }> }) {
  const { accountId } = await params;
  const aId = Number(accountId);

  if (isNaN(aId)) return <p>ID invalide</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <TransactionsListWrapper accountId={aId} />
    </div>
  );
}
