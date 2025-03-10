'use client';

import { AccountTransaction, defaultAccountTransaction } from "@/app/db/schema";
import FormComponent from "@/app/components/global/FormComponent";
import FormField from "@/app/types/formField";
import { AccountTransactionService } from "@/app/services/accountTransactionService";

export default function AccountTransactionForm({ userId, accountId, accountTransaction }: { userId: number, accountId: number, accountTransaction?: AccountTransaction }) {
  const initialData = {
    ...defaultAccountTransaction(),
    ...accountTransaction,
    userId,
    bankAccountId: accountTransaction?.bankAccountId || accountId
  };

  const fields: FormField[] = [
    { name: "amount", label: "Montant", type: "number" },
    { name: "type", label: "Type", type: "select", options: ["income", "expense"] },
    { name: "category", label: "Catégorie", type: "text" },
    { name: "date", label: "Date", type: "date" },
    { name: "description", label: "Description", type: "text" },
  ];
  

  const onSubmit = async (data: AccountTransaction) => {
    await AccountTransactionService.addAccountTransaction({ ...data, createdAt: new Date() });
  };

  return <FormComponent initialData={initialData} fields={fields} onSubmit={onSubmit} title="Créer une transaction" />;
}