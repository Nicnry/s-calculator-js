'use client';

import { Salary, defaultSalary } from "@/app/db/schema";
import SalaryService from "@/app/services/salaryService";
import FormComponent from "@/app/components/global/FormComponent";
import { salaryFields } from "@/app/components/salaries/salaryFormFields";
import { useUser } from "@/app/contexts/UserContext";

export default function SalaryForm({ salary, update = false }: SalaryFormProps) {
  const { user } = useUser();

  const initialData = { ...defaultSalary(), ...salary, userId: user!.id! };

  const onSubmit = async (data: Salary) => {
    if(update) {
      await SalaryService.updateSalary(salary!.id!, { ...data, createdAt: new Date() });
    } else {
      await SalaryService.addSalary({ ...data, createdAt: new Date() });
    }
  };

  return <FormComponent initialData={initialData} fields={salaryFields} onSubmit={onSubmit} title={update ? "Modifier le salaire" : "Créer un salaire"} />;
}

interface SalaryFormProps {
  salary?: Salary;
  update?: boolean;
}