import AccountEdit from "@/components/accounts/accountEdit";

export default async function EditAccountPage({ params }: EditAccountPageParams) {
  const { accountId } = await params;
  const aId = Number(accountId);

  if (isNaN(aId)) return <p>ID invalide</p>;
  
  return <AccountEdit accountId={aId} />;
}

type EditAccountPageParams = {
  params: Promise<{ accountId: string }>
};