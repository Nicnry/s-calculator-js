import TransactionDetails from "@/app/components/transactions/transactionDetails";

export default async function SalaryShowPage({ params }: SalaryShowPageParams) {
  const { userId, accountId, transactionId } = await params;
  const uId = Number(userId);
  const aId = Number(accountId);
  const tId = Number(transactionId);

  if (isNaN(uId)) return <p>ID invalide</p>;
  
  return (
    <div className="container mx-auto px-4 py-8">
      <TransactionDetails userId={uId} accountId={aId} transactionId={tId} />
    </div>
  );
}

type SalaryShowPageParams = {
  params: Promise<{ userId: string, accountId: string, transactionId: string }>
};