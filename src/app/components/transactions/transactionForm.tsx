'use client';

import { Salary, defaultSalary } from "@/app/db/schema";
import { SalaryService } from "@/app/services/salaryService";
import FormComponent from "@/app/components/global/FormComponent";
import FormField from "@/app/types/formField";

export default function TransactionForm({ userId, salary }: { userId: number, salary?: Salary }) {
  const initialData = { ...defaultSalary(), ...salary, userId };

  const fields: FormField[] = [
    { name: "totalSalary", label: "Salaire brut", type: "number" },
    { name: "taxableSalary", label: "Salaire taxable", type: "number" },
    { name: "avsAiApgContribution", label: "Cotisation AVS", type: "number" },
    { name: "vdLpcfamDeduction", label: "Cotisation LPC FAM", type: "number" },
    { name: "acDeduction", label: "Cotisation chômage", type: "number" },
    { name: "aanpDeduction", label: "Cotisation AANP", type: "number" },
    { name: "ijmA1Deduction", label: "Cotisation IJMA1", type: "number" },
    { name: "lppDeduction", label: "Cotisation LPP", type: "number" },
    { name: "monthlyPayments", label: "Récurrence", type: "number" },
  ];

  const onSubmit = async (data: Salary) => {
    await SalaryService.addSalary({ ...data, createdAt: new Date() });
  };

  return <FormComponent initialData={initialData} fields={fields} onSubmit={onSubmit} title="Créer un salaire" />;
}