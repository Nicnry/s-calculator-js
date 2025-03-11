export default async function EditAccountTransactionPage({ params, }: { params: Promise<{ userId: string, accountId: string }> }) {
  const { userId, accountId } = await params;
  const uId = Number(userId);
  const aId = Number(accountId);

  if (isNaN(uId) || isNaN(aId)) return <p>ID invalide</p>;
  return <></>;
  //return <AccountEdit userId={uId} accountId={aId} />;
    
}