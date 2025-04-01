import SalaryDetails from "@/components/salaries/salaryDetails";

export default async function SalaryShowPage({ params }: SalaryShowPageParams) {
  const { salaryId } = await params;
  const sId = Number(salaryId);

  if (isNaN(sId)) return <p>ID invalide</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <SalaryDetails salaryId={sId} />
    </div>
  );
}

type SalaryShowPageParams = {
  params: Promise<{ salaryId: string }>
};