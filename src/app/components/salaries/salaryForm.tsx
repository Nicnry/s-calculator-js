'use client';

import { Salary, defaultSalary } from "@/app/db/schema";
import SalaryService from "@/app/services/salaryService";
import FormComponent from "@/app/components/global/FormComponent";
import { salaryFields } from "@/app/components/salaries/salaryFormFields";

export default function SalaryForm({ userId, salary, update = false }: { userId: number, salary?: Salary, update?: boolean }) {
  const initialData = { ...defaultSalary(), ...salary, userId };

  const onSubmit = async (data: Salary) => {
    if(update) {
      await SalaryService.updateSalary(salary!.id!, { ...data, createdAt: new Date() });
    } else {
      await SalaryService.addSalary({ ...data, createdAt: new Date() });
    }
  };

  return <FormComponent initialData={initialData} fields={salaryFields} onSubmit={onSubmit} title={update ? "Modifier le salaire" : "Créer un salaire"} />;
}