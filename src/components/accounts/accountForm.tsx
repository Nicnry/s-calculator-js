'use client'

import { UserAccountService } from "@/services/userAccountService";
import { BankAccount, defaultAccount } from "@/db/schema";
import FormComponent from "@/components/global/FormComponent";
import { accountFormFields } from "@/components/accounts/accountFormFields";
import { useUser } from "@/contexts/UserContext";
import { useAccounts } from "@/contexts/AccountsContext";

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