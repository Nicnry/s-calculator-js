'use client';

import { AccountTransaction, defaultAccountTransaction } from "@/app/db/schema";
import FormComponent from "@/app/components/global/FormComponent";
import { AccountTransactionService } from "@/app/services/accountTransactionService";
import { transactionFormFields } from "@/app/components/transactions/transactionFormFields";

export default function AccountTransactionForm({ userId, accountId, accountTransaction, update = false }: AccountTransactionFormProps) {
  const initialData = {
    ...defaultAccountTransaction(),
    ...accountTransaction,
    userId,
    bankAccountId: accountTransaction?.bankAccountId || accountId
  };
  

  const onSubmit = async (data: AccountTransaction) => {
    if(update) {
      await AccountTransactionService.updateAccountTransaction(accountTransaction!.id!, { ...data, createdAt: new Date() });
    } else {
      await AccountTransactionService.addAccountTransaction({ ...data, createdAt: new Date() });
    }
  };

  return <FormComponent initialData={initialData} fields={transactionFormFields} onSubmit={onSubmit} title="Créer une transaction" />;
}

type AccountTransactionFormProps = {
  userId: number;
  accountId: number;
  accountTransaction?: AccountTransaction;
  update?: boolean;
}