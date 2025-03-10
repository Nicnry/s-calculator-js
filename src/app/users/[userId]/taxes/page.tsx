import SalariesListWrapper from "@/app/components/salaries/salariesListWrapper";

export default async function SalaryPage({ params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params;
  const id = Number(userId);

  if (isNaN(id)) return <p>ID invalide</p>;

  return (
    <>
      <SalariesListWrapper userId={id} />
    </>
  );
}
