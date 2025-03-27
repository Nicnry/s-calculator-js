import AccountDetails from "@/app/components/accounts/accountDetails";

export default async function SalaryShowPage({ params, }: { params: Promise<{ accountId: string }> }) {
  const { accountId } = await params;
  const aId = Number(accountId);

  if (isNaN(aId)) return <p>ID invalide</p>;
  
  return (
    <div className="container mx-auto px-4 py-8">
      <AccountDetails accountId={aId} />
    </div>
  );
}