import { Wallet, FileText, ShieldCheck, PiggyBank, Briefcase, HeartPulse, Repeat, Percent, Calendar } from "lucide-react";
import FormField from "@/app/types/formField";

export const salaryFields: FormField[] = [
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
  { name: "from", label: "Date de début", type: "date", icon: <Calendar /> },
  { name: "to", label: "Date de fin", type: "date", icon: <Calendar /> },
];