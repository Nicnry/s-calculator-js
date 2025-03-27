'use client'
/* import { useState } from 'react';
import { UserAccountService } from "@/app/services/userAccountService"; */
import { BankAccount, defaultAccount } from "@/app/db/schema";

export default function useAccountForm({userId, existingAccount = null, /* isUpdate = false */}: UseAccountFormProps) {
const initialData = { ...defaultAccount(), ...existingAccount, userId };
//const [loading, setLoading] = useState(false);
//const [error, setError] = useState(null);

/* const submitAccount = async (data: BankAccount) => {
  setLoading(true);
  setError(null);
  
  try {
    if (isUpdate && existingAccount) {
      return await UserAccountService.updateAccount(existingAccount.id!, { 
        ...data, 
        updatedAt: new Date() 
      });
    } else {
      return await UserAccountService.addAccount({ 
        ...data, 
        createdAt: new Date() 
      });
    }
  } catch (err) {
    setError(err.message || "Erreur lors de l'enregistrement du compte");
    throw err;
  } finally {
    setLoading(false);
  }
}; */

return {
  initialData,
  /* submitAccount,
  loading,
  error */
};
}

type UseAccountFormProps = {
  userId: number;
  existingAccount?: BankAccount | null;
  isUpdate?: boolean;
}