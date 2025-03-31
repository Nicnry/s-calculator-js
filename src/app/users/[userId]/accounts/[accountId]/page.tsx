import AccountDetails from "@/components/accounts/accountDetails";

export default async function AccountShowPage({ params }: AccountShowPageParams) {
  const { accountId } = await params;
  const aId = Number(accountId);

  if (isNaN(aId)) return <p>ID invalide</p>;
  
  return (
    <div className="container mx-auto px-4 py-8">
      <AccountDetails accountId={aId} />
    </div>
  );
}

type AccountShowPageParams = {
  params: Promise<{ accountId: string }>
};