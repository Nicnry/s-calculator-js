import TransactionsListWrapper from "@/app/components/transactions/transactionsListWrapper";

export default async function TransactionsPage({ params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params;
  const id = Number(userId);

  if (isNaN(id)) return <p>ID invalide</p>;

  return (
    <TransactionsListWrapper />
  );
}
