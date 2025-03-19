import FixedExpensesListWrapper from "@/app/components/fixedExpenses/fixedExpensesListWrapper";

export default async function FixedExpensePage({ params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params;
  const id = Number(userId);

  if (isNaN(id)) return <p>ID invalide</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <FixedExpensesListWrapper userId={id} />
    </div>
  );
}