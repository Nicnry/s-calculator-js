'use client'

import { UserAccountService } from "@/app/services/userAccountService";
import { BankAccount, defaultAccount } from "@/app/db/schema";
import FormComponent from "@/app/components/global/FormComponent";
import { accountFormFields } from "@/app/components/accounts/accountFormFields";
//import useAccountForm from "@/app/db/hooks/useAccountForm";


export default function AccountForm({ userId, account, update = false }: { userId: number, account?: BankAccount, update?: boolean }) {
  const initialData = { ...defaultAccount(), ...account, userId };
  //const { initialData, submitAccount, loading, error } = useAccountForm(userId, account, update);

  const onSubmit = async (data: BankAccount) => {
    if(update) {
      await UserAccountService.updateAccount(account!.id!, { ...data, createdAt: new Date() });
    } else {
      await UserAccountService.addAccount({ ...data, createdAt: new Date() });
    }
  };

  return <FormComponent initialData={initialData} fields={accountFormFields} onSubmit={onSubmit}  title={update ? "Modifier le compte" : "Créer un compte"} />;
}