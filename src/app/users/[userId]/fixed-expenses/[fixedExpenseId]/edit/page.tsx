import FixedExpenseEdit from "@/app/components/fixedExpenses/fixedExpenseEdit";

export default async function EditFixedExpensesPage({ params }: { params: Promise<{ fixedExpenseId: string }> }) {
  const { fixedExpenseId } = await params;
  const fId = Number(fixedExpenseId);

  if (isNaN(fId)) return <p>ID invalide</p>;
  
  return <FixedExpenseEdit fixedExpenseId={fId} />;
    
}