import TransactionsListWrapper from "@/components/transactions/transactionsListWrapper";

export default async function TransactionsPage({ params }: TransactionsPageParams) {
  const { accountId } = await params;
  const aId = Number(accountId);

  if (isNaN(aId)) return <p>ID invalide</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <TransactionsListWrapper accountId={aId} />
    </div>
  );
}

type TransactionsPageParams = {
  params: Promise<{ accountId: string }>
};