import TransactionEdit from "@/app/components/transactions/transactionEdit";

export default async function EditAccountTransactionPage({ params }: { params: Promise<{ userId: string, accountId: string, transactionId: string }> }) {
  const { userId, accountId, transactionId } = await params;
  const uId = Number(userId);
  const aId = Number(accountId);
  const tId = Number(transactionId);

  if (isNaN(uId) || isNaN(aId) || isNaN(tId)) return <p>ID invalide</p>;
  return <TransactionEdit userId={uId} accountId={aId} transactionId={tId} />;
    
}