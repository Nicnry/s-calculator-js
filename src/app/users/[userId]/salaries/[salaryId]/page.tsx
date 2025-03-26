import SalaryDetails from "@/app/components/salaries/salaryDetails";


export default async function SalaryShowPage({ params }: SalaryShowPageProps) {
  const { salaryId } = await params;
  const aId = Number(salaryId);

  if (isNaN(aId)) return <p>ID invalide</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <SalaryDetails salaryId={aId} />
    </div>
  );
}


interface SalaryShowPageParams {
  salaryId: string;
}

interface SalaryShowPageProps {
  params: SalaryShowPageParams;
}