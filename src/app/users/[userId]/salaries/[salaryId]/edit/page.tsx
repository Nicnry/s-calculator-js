import AccountDetails from "@/app/components/accounts/accountDetails";

export default async function EditAccountPage({ params, }: { params: Promise<{ userId: string, accountId: string }> }) {
    const { userId, accountId } = await params;
    const uId = Number(userId);
    const aId = Number(accountId);
  
    if (isNaN(uId)) return <p>ID invalide</p>;
    
    return <AccountDetails userId={uId} accountId={aId} />;
}