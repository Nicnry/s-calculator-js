'use client'

import { UserAccountService } from "@/app/services/userAccountService";
import { BankAccount, defaultAccount } from "@/app/db/schema";
import FormComponent from "@/app/components/global/FormComponent";
import { accountFormFields } from "@/app/components/accounts/accountFormFields";
import { useUser } from "@/app/contexts/UserContext";

export default function AccountForm({ account, update = false }: AccountFormProps) {
  const { user } = useUser();
  const initialData = { ...defaultAccount(), ...account, userId: user!.id! };
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

type AccountFormProps = {
  account?: BankAccount;
  update?: boolean;
};