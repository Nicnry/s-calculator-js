import AccountsStatistics from "@/app/components/accounts/accountsStatistics";

export default async function AccountStatsPage({ params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params;
  const id = Number(userId);

  if (isNaN(id)) return <p>ID invalide</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <AccountsStatistics userId={id} />
    </div>
  );
}