import FixedExpensesDetails from "@/app/components/fixedExpenses/fixedExpensesDetails";

export default async function SalaryShowPage({ params, }: { params: Promise<{ fixedExpenseId: string }> }) {
  const { fixedExpenseId } = await params;
  const fId = Number(fixedExpenseId);

  if (isNaN(fId)) return <p>ID invalide</p>;
  
  return (
    <div className="container mx-auto px-4 py-8">
      <FixedExpensesDetails fixedExpenseId={fId} />
    </div>
  );
}