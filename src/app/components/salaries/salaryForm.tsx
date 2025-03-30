'use client';

import { Salary, defaultSalary } from "@/app/db/schema";
import SalaryService from "@/app/services/salaryService";
import FormComponent from "@/app/components/global/FormComponent";
import { salaryFields } from "@/app/components/salaries/salaryFormFields";
import { useUser } from "@/app/contexts/UserContext";
import { useSalaries } from "@/app/contexts/SalariesContext";

export default function SalaryForm({ salary, update = false }: SalaryFormProps) {
  const { user } = useUser();
  const { addSalary } = useSalaries();
  const initialData = { ...defaultSalary(), ...salary, userId: user!.id! };

  const onSubmit = async (data: Salary) => {
    try {
      const salary = { ...data, createdAt: new Date() };
      if (update) {
        await SalaryService.updateSalary(salary!.id!, salary);
      } else {
        if (addSalary) {
          await addSalary(salary);
        } else {
          console.warn("La fonction addSalary n'est pas disponible dans le contexte");
        }
      }
    } catch (error) {
      console.error("Erreur lors de la soumission du formulaire:", error);
    }
  };

  return (
    <FormComponent
      initialData={initialData}
      fields={salaryFields}
      onSubmit={onSubmit}
      title={update ? "Modifier le salaire" : "Créer un salaire"}
    />
  );
}

interface SalaryFormProps {
  salary?: Salary;
  update?: boolean;
}