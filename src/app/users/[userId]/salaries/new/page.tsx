import SalaryForm from "@/app/components/salaries/salaryForm";

export default async function NewSalaryPage({ params, }: { params: Promise<{ userId: string }> }) {

  const { userId } = await params;
  const id = Number(userId);

  if (isNaN(id)) return <p>ID invalide</p>;
  return (
    <div className="p-6">
      <SalaryForm userId={id} />
    </div>
  );
}
