import AccountDetails from "@/app/components/accounts/accountDetails";

export default async function SalaryShowPage({ params, }: { params: Promise<{ userId: string, accountId: string }> }) {
  const { userId, accountId } = await params;
  const uId = Number(userId);
  const aId = Number(accountId);

  if (isNaN(uId)) return <p>ID invalide</p>;
  
  return (
    <div className="container mx-auto px-4 py-8">
      <AccountDetails userId={uId} accountId={aId} />
    </div>
  );
}