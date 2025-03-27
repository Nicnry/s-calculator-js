import AccountEdit from "@/app/components/accounts/accountEdit";

export default async function EditAccountPage({ params }: { params: Promise<{ accountId: string }> }) {
  const { accountId } = await params;
  const aId = Number(accountId);

  if (isNaN(aId)) return <p>ID invalide</p>;
  
  return <AccountEdit accountId={aId} />;
    
}