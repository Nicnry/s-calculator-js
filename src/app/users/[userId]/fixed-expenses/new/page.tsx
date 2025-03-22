import ExpenseForm from "@/app/components/fixedExpenses/expenseForm";

export default async function NewExpensePage({ params, }: { params: Promise<{ userId: string }> }) {

  const { userId } = await params;
  const id = Number(userId);

  if (isNaN(id)) return <p>ID invalide</p>;
  return (
    <ExpenseForm userId={id} />
  );
}
