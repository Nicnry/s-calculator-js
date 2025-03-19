'use client'

import FixedExpenseService from "@/app/services/fixedExpenseService";
import { FixedExpense, FixedExpenseCreate } from "@/app/db/schema";
import FormComponent from "@/app/components/global/FormComponent";
import FormField from "@/app/types/formField";
import { Tag, Calculator, RotateCcw, CheckSquare, CreditCard } from "lucide-react";

export default function ExpenseForm({ 
  userId, 
  expense, 
  update = false 
}: { 
  userId: number, 
  expense?: FixedExpenseCreate | FixedExpense | undefined, 
  update?: boolean 
}) {
  const initialData = { 
    userId,
    title: expense?.title || "",
    amount: expense?.amount || 0,
    category: expense?.category || "",
    date: expense?.date || new Date().toISOString().split('T')[0],
    recurrence: expense?.recurrence || "mensuelle",
    paid: expense?.paid ? "true" : "false",
    paymentMethod: expense?.paymentMethod || "Autre",
    endDate: expense?.endDate || "",
  };

  const fields: FormField[] = [
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
  ];

  const onSubmit = async (data: typeof initialData) => {
    const now = new Date();
    
    const submissionData = {
      userId: userId,
      title: data.title,
      amount: Number(data.amount),
      category: data.category,
      date: data.date,
      recurrence: data.recurrence,
      paid: data.paid === "true",
      paymentMethod: data.paymentMethod,
      createdAt: now,
      updatedAt: now
    };

    if (update) {
      if (expense && 'id' in expense) {
        await FixedExpenseService.updateFixedExpense(expense.id, submissionData);
      } else {
        throw new Error("Expense must have an 'id' to be updated.");
      }
    } else {
      await FixedExpenseService.addFixedExpense(submissionData);
    }
  };

  return (
    <FormComponent 
      initialData={initialData} 
      fields={fields} 
      onSubmit={onSubmit}  
      title={update ? "Modifier la charge" : "Créer une charge"} 
    />
  );
}