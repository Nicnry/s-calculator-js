import SalaryEdit from "@/app/components/salaries/salaryEdit";

export default async function EditSalaryPage({ params, }: { params: Promise<{ userId: string, salaryId: string }> }) {
  const { userId, salaryId } = await params;
  const uId = Number(userId);
  const sId = Number(salaryId);

  if (isNaN(uId) || isNaN(sId)) return <p>ID invalide</p>;
  
  return <SalaryEdit userId={uId} salaryId={sId} />;
    
}