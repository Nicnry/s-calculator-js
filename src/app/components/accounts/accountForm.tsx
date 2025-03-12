'use client'

import { UserAccountService } from "@/app/services/userAccountService";
import { BankAccount, defaultAccount } from "@/app/db/schema";
import FormComponent from "@/app/components/global/FormComponent";
import FormField from "@/app/types/formField";
import { Banknote, Hash, Wallet, DollarSign, Coins } from "lucide-react";


export default function AccountForm({ userId, account, update = false }: { userId: number, account?: BankAccount, update?: boolean }) {
  const initialData = { ...defaultAccount(), ...account, userId };

  const fields: FormField[] = [
    { name: "bankName", label: "Nom banque", placeholder: "UBS", icon: <Banknote /> },
    { name: "accountNumber", label: "No compte", placeholder: "CH1589144187277187766", icon: <Hash /> },
    { name: "accountType", label: "Type de compte", type: "select", options: ["Courant", "Épargne"], icon: <Wallet /> },
    { name: "balance", label: "Montant", type: "number", value: "1000", icon: <DollarSign /> },
    { name: "currency", label: "Monnaie", placeholder: "CHF", icon: <Coins /> },
  ];

  const onSubmit = async (data: BankAccount) => {
    if(update) {
      await UserAccountService.updateAccount(account!.id!, { ...data, createdAt: new Date() });
    } else {
      await UserAccountService.addAccount({ ...data, createdAt: new Date() });
    }
  };

  return <FormComponent initialData={initialData} fields={fields} onSubmit={onSubmit}  title={update ? "Modifier le compte" : "Créer un compte"} />;
}