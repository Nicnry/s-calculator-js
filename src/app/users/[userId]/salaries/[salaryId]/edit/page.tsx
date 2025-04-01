import SalaryEdit from "@/components/salaries/salaryEdit";

export default async function EditSalaryPage({ params }: EditSalaryPageParams) {
  const { salaryId } = await params;
  const sId = Number(salaryId);

  if (isNaN(sId)) return <p>ID invalide</p>;
  
  return <SalaryEdit salaryId={sId} />;
    
}

type EditSalaryPageParams = {
  params: Promise<{ salaryId: string }>
};