import SalaryEdit from "@/app/components/salaries/salaryEdit";

export default async function EditSalaryPage({ params }: { params: Promise<{ salaryId: string }> }) {
  const { salaryId } = await params;
  const sId = Number(salaryId);

  if (isNaN(sId)) return <p>ID invalide</p>;
  
  return <SalaryEdit salaryId={sId} />;
    
}