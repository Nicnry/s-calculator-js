import SalariesStatistics from "@/app/components/fixedExpenses/expensesStatistics";

export default async function FixedExpenseStatsPage({ params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params;
  const id = Number(userId);

  if (isNaN(id)) return <p>ID invalide</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <SalariesStatistics userId={id} />
    </div>
  );
}