'use client'

import { UserAccountService } from "@/app/services/userAccountService";
import { BankAccount, defaultAccount } from "@/app/db/schema";
import FormComponent from "@/app/components/global/FormComponent";
import { accountFormFields } from "@/app/components/accounts/accountFormFields";
import { useUser } from "@/app/contexts/UserContext";
import { useAccounts } from "@/app/contexts/AccountsContext";

export default function AccountForm({ account, update = false }: AccountFormProps) {
  const { user } = useUser();
  const { addAccount } = useAccounts();
  const initialData = { ...defaultAccount(), ...account, userId: user!.id! };

  const onSubmit = async (data: BankAccount) => {
    try {
      const account = { ...data, createdAt: new Date() };
      if (update) {
        await UserAccountService.updateAccount(account!.id!, account);
      } else {
        await UserAccountService.addAccount(account);
        if (addAccount) {
          await addAccount(account);
        } else {
          console.warn("La fonction addAccount n'est pas disponible dans le contexte");
        }
      }
    } catch (error) {
      console.error("Erreur lors de la soumission du formulaire:", error);
    }
  };

  return (
    <FormComponent 
      initialData={initialData} 
      fields={accountFormFields} 
      onSubmit={onSubmit}  
      title={update ? "Modifier le compte" : "Créer un compte"} 
    />
  );
}

type AccountFormProps = {
  account?: BankAccount;
  update?: boolean;
};