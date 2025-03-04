import SalaryList from "@/app/components/SalaryList";
import SalaryForm from "@/app/components/SalaryForm";

export default function UserSalariesPage({ params }: { params: { id: string } }) {
  const userId = parseInt(params.id);

  return (
    <div>
      <h1>Salaires de l'utilisateur {userId}</h1>
      <SalaryForm userId={userId} />
      <SalaryList userId={userId} />
    </div>
  );
}
