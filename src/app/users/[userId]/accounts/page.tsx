import AccountsListWrapper from "@/app/components/accounts/accountsListWrapper";

export default async function AccountPage({ params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params;
  const id = Number(userId);

  if (isNaN(id)) return <p>ID invalide</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <AccountsListWrapper userId={id} />
    </div>
  );
}