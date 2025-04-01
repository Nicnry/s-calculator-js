'use client';

import { BankAccount } from "@/db/schema";
import { useState, useEffect } from "react";
import AccountForm from "@/components/accounts/accountForm";
import { UserAccountService } from "@/services/userAccountService";
import { useUser } from "@/contexts/UserContext";

export default function AccountEdit({ accountId }: AccountEditProps) {
  const { user } = useUser();
  const [account, setAccount] = useState<BankAccount>();
  
  useEffect(() => {
    (async () => {
      setAccount(await UserAccountService.getUserAccountById(user!.id!, accountId));
    })();
  }, [user, accountId]);  

  return (
    <div>
      {account ? <AccountForm account={account} update /> : <p>Chargement...</p>}
    </div>
  );
}

type AccountEditProps = {
  accountId: number;
};