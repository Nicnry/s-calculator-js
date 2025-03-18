import AccountEdit from "@/app/components/accounts/accountEdit";

export default async function EditAccountPage({ params, }: { params: Promise<{ userId: string, accountId: string }> }) {
  const { userId, accountId } = await params;
  const uId = Number(userId);
  const aId = Number(accountId);

  if (isNaN(uId) || isNaN(aId)) return <p>ID invalide</p>;
  
  return <AccountEdit userId={uId} accountId={aId} />;
    
}