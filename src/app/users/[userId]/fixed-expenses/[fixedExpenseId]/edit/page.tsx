import FixedExpenseEdit from "@/app/components/fixedExpenses/fixedExpenseEdit";

export default async function EditFixedExpensesPage({ params, }: { params: Promise<{ userId: string, fixedExpenseId: string }> }) {
  const { userId, fixedExpenseId } = await params;
  const uId = Number(userId);
  const fId = Number(fixedExpenseId);

  if (isNaN(uId) || isNaN(fId)) return <p>ID invalide</p>;
  
  return <FixedExpenseEdit userId={uId} fixedExpenseId={fId} />;
    
}