import FixedExpensesDetails from "@/app/components/fixedExpenses/fixedExpensesDetails";

export default async function SalaryShowPage({ params, }: { params: Promise<{ userId: string, fixedExpenseId: string }> }) {
  const { userId, fixedExpenseId } = await params;
  const uId = Number(userId);
  const fId = Number(fixedExpenseId);

  if (isNaN(uId)) return <p>ID invalide</p>;
  
  return (
    <div className="container mx-auto px-4 py-8">
      <FixedExpensesDetails userId={uId} fixedExpenseId={fId} />
    </div>
  );
}