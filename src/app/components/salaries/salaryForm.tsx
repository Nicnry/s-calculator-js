'use client';

import { Salary, defaultSalary } from "@/app/db/schema";
import { SalaryService } from "@/app/services/salaryService";
import FormComponent from "@/app/components/global/FormComponent";
import FormField from "@/app/types/formField";
import { Wallet, FileText, ShieldCheck, PiggyBank, Briefcase, HeartPulse, Repeat, Percent } from "lucide-react";

export default function SalaryForm({ userId, salary, update = false }: { userId: number, salary?: Salary, update?: boolean }) {
  const initialData = { ...defaultSalary(), ...salary, userId };

  const fields: FormField[] = [
    { name: "totalSalary", label: "Salaire brut", type: "number", icon: <Wallet /> },
    { name: "taxableSalary", label: "Salaire taxable", type: "number", icon: <FileText /> },
    { 
      name: "employmentRate", 
      label: "Taux de travail", 
      type: "range", 
      icon: <Percent />,
      min: 0,
      max: 100,
      step: 5
    },
    { name: "avsAiApgContribution", label: "Cotisation AVS", type: "number", icon: <ShieldCheck /> },
    { name: "vdLpcfamDeduction", label: "Cotisation LPC FAM", type: "number", icon: <PiggyBank /> },
    { name: "acDeduction", label: "Cotisation chômage", type: "number", icon: <Briefcase /> },
    { name: "aanpDeduction", label: "Cotisation AANP", type: "number", icon: <HeartPulse /> },
    { name: "ijmA1Deduction", label: "Cotisation IJMA1", type: "number", icon: <HeartPulse /> },
    { name: "lppDeduction", label: "Cotisation LPP", type: "number", icon: <PiggyBank /> },
    { name: "monthlyPayments", label: "Récurrence", type: "number", icon: <Repeat /> },
  ];

  const onSubmit = async (data: Salary) => {
    if(update) {
      await SalaryService.updateSalary(salary!.id!, { ...data, createdAt: new Date() });
    } else {
      await SalaryService.addSalary({ ...data, createdAt: new Date() });
    }
  };

  return <FormComponent initialData={initialData} fields={fields} onSubmit={onSubmit} title={update ? "Modifier le salaire" : "Créer un salaire"} />;
}