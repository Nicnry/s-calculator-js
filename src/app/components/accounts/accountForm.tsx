'use client'

import { UserAccountService } from "@/app/services/userAccountService";
import { BankAccount, defaultAccount } from "@/app/db/schema";
import FormComponent from "@/app/components/global/FormComponent";
import FormField from "@/app/types/formField";


export default function AccountForm({ userId, account, update = false }: { userId: number, account?: BankAccount, update?: boolean }) {
  const initialData = { ...defaultAccount(), ...account, userId };

  const fields: FormField[] = [
    { name: "bankName", label: "Nom banque" },
    { name: "accountNumber", label: "No compte" },
    { name: "accountType", label: "Type de compte" },
    { name: "balance", label: "Montant", type: "number" },
    { name: "currency", label: "Monnaie" },
  ];

  const onSubmit = async (data: BankAccount) => {
    if(update) {
      await UserAccountService.updateAccount(account!.id!, { ...data, createdAt: new Date() });
    } else {
      await UserAccountService.addAccount({ ...data, createdAt: new Date() });
    }
  };

  return <FormComponent initialData={initialData} fields={fields} onSubmit={onSubmit} title="Créer un compte" />;
}