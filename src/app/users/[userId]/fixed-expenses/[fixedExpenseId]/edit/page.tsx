import FixedExpenseEdit from "@/components/fixedExpenses/fixedExpenseEdit";

export default async function EditFixedExpensesPage({ params }: EditFixedExpensesPageParams) {
  const { fixedExpenseId } = await params;
  const fId = Number(fixedExpenseId);

  if (isNaN(fId)) return <p>ID invalide</p>;
  
  return <FixedExpenseEdit fixedExpenseId={fId} />;
}

type EditFixedExpensesPageParams = {
  params: Promise<{ fixedExpenseId: string }>
};