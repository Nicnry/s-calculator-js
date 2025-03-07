import SalaryDetails from "@/app/components/salaries/salaryDetails";

export default async function SalaryShowPage({ params, }: { params: Promise<{ userId: string, salaryId: string }> }) {
  const { userId, salaryId } = await params;
  const uId = Number(userId);
  const aId = Number(salaryId);

  if (isNaN(uId)) return <p>ID invalide</p>;

  return <SalaryDetails userId={uId} salaryId={aId} />;
}