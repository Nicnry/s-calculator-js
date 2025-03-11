'use client';

import { BankAccount, User } from "@/app/db/schema";
import { UserService } from "@/app/services/userService";
import { useState, useEffect } from "react";
import AccountForm from "@/app/components/accounts/accountForm";
import { UserAccountService } from "@/app/services/userAccountService";

export default function AccountEdit({ userId, accountId }: { userId: number; accountId: number }) {
  const [user, setUser] = useState<User>();
  const [account, setAccount] = useState<BankAccount>();
  
  useEffect(() => {
    (async () => {
      setUser(await UserService.getUserById(userId));
      setAccount(await UserAccountService.getUserAccountById(userId, accountId));
    })();
  }, [userId, accountId]);  

  return (
    <div>
      {user && account ? <AccountForm userId={user.id!} account={account} update /> : <p>Chargement...</p>}
    </div>
  );
}