'use client'

import { AccountService } from "@/app/services/accountService";
import { BankAccount, defaultAccount } from "@/app/db/schema";
import FormComponent from "@/app/components/global/FormComponent";
import FormField from "@/app/types/formField";


export default function AccountForm({ userId, account }: { userId: number, account?: BankAccount }) {
  const initialData = { ...defaultAccount(), ...account, userId };

  const fields: FormField[] = [
    { name: "bankName", label: "Nom banque" },
    { name: "accountNumber", label: "No compte" },
    { name: "accountType", label: "Type de compte" },
    { name: "balance", label: "Montant", type: "number" },
    { name: "currency", label: "Monnaie" },
  ];

  const onSubmit = async (data: BankAccount) => {
    await AccountService.addAccount({ ...data, createdAt: new Date() });
  };

  return <FormComponent initialData={initialData} fields={fields} onSubmit={onSubmit} title="Créer un compte" />;
}