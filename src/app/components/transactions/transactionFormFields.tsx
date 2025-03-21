import { DollarSign, ListChecks, Tag, FileText, Calendar } from "lucide-react";
import FormField from "@/app/types/formField";

export const transactionFormFields: FormField[] = [
  { name: "amount", label: "Montant", type: "number", icon: <DollarSign /> },  
  { name: "type", label: "Type", type: "select", options: ["Income", "Expense"], icon: <ListChecks /> },  
  { name: "category", label: "Catégorie", type: "text", placeholder: "Alimentaire", icon: <Tag /> },  
  { name: "date", label: "Date", type: "date", icon: <Calendar /> },  
  { name: "description", label: "Description", type: "text", placeholder: "Courses de la semaine.", icon: <FileText /> },  
  { name: "from", label: "Date de début", type: "date", icon: <Calendar /> },
  { name: "to", label: "Date de fin", type: "date", icon: <Calendar /> },
];

