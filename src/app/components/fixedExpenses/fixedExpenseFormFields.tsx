import { Tag, Calculator, RotateCcw, CheckSquare, CreditCard, Calendar } from "lucide-react";
import FormField from "@/app/types/formField";

export const fixedExpenseFormFields: FormField[] = [
  { name: "title", label: "Titre", placeholder: "Loyer", icon: <Tag /> },
  { name: "amount", label: "Montant", type: "number", placeholder: "1000", icon: <Calculator /> },
  { 
    name: "category", 
    label: "Catégorie", 
    type: "select",
    options: ["Logement", "Alimentation", "Transport", "Loisirs", "Santé", "Éducation", "Autre"],
    icon: <Calculator /> 
  },
  { 
    name: "recurrence", 
    label: "Récurrence", 
    type: "select", 
    options: ["quotidienne", "hebdomadaire", "mensuelle", "annuelle", "ponctuelle"],
    icon: <RotateCcw /> 
  },
  { 
    name: "paid", 
    label: "Payé", 
    type: "select", 
    options: ["true", "false"],
    icon: <CheckSquare /> 
  },
  { 
    name: "paymentMethod", 
    label: "Méthode de paiement", 
    type: "select", 
    options: ["Carte", "Virement", "Prélèvement", "Espèces", "Autre"],
    icon: <CreditCard /> 
  },
  { name: "from", label: "Date de début", type: "date", icon: <Calendar /> },
  { name: "to", label: "Date de fin", type: "date", icon: <Calendar /> },
];