import SalaryList from "@/app/components/SalaryList";
import SalaryForm from "@/app/components/SalaryForm";
import { getUserById } from "@/app/services/userService";

export default async function UserSalariesPage({ params }: { params: { id: string } }) {
  const userId = parseInt(params.id);

  const user = await getUserById(userId);

  if (!user) {
    return <p>Utilisateur non trouvé</p>;
  }

  return (
    <div>
      <h1>Salaires de l'utilisateur {userId}</h1>
      <SalaryForm userId={userId} />
      <SalaryList userId={userId} />
    </div>
  );
}
