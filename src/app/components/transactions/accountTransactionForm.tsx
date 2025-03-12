'use client';

import { AccountTransaction, defaultAccountTransaction } from "@/app/db/schema";
import FormComponent from "@/app/components/global/FormComponent";
import FormField from "@/app/types/formField";
import { AccountTransactionService } from "@/app/services/accountTransactionService";
import { DollarSign, ListChecks, Tag, Calendar, FileText } from "lucide-react";

export default function AccountTransactionForm({ userId, accountId, accountTransaction, update = false }: { userId: number, accountId: number, accountTransaction?: AccountTransaction, update?: boolean }) {
  const initialData = {
    ...defaultAccountTransaction(),
    ...accountTransaction,
    userId,
    bankAccountId: accountTransaction?.bankAccountId || accountId
  };
  console.log(accountTransaction, initialData);

  const fields: FormField[] = [
    { name: "amount", label: "Montant", type: "number", icon: <DollarSign /> },  
    { name: "type", label: "Type", type: "select", options: ["Income", "Expense"], icon: <ListChecks /> },  
    { name: "category", label: "Catégorie", type: "text", placeholder: "Alimentaire", icon: <Tag /> },  
    { name: "date", label: "Date", type: "date", icon: <Calendar /> },  
    { name: "description", label: "Description", type: "text", placeholder: "Courses de la semaine.", icon: <FileText /> },  
  ];
  

  const onSubmit = async (data: AccountTransaction) => {
    if(update) {
      await AccountTransactionService.updateAccountTransaction(accountTransaction!.id!, { ...data, createdAt: new Date() });
    } else {
      await AccountTransactionService.addAccountTransaction({ ...data, createdAt: new Date() });
    }
  };

  return <FormComponent initialData={initialData} fields={fields} onSubmit={onSubmit} title="Créer une transaction" />;
}