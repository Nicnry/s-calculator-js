import FixedExpensesListWrapper from "@/app/components/fixedExpenses/fixedExpensesListWrapper";

export default async function FixedExpensePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <FixedExpensesListWrapper />
    </div>
  );
}