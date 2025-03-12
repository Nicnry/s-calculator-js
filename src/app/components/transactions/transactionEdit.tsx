'use client';

import { AccountTransaction, BankAccount, User } from "@/app/db/schema";
import { UserService } from "@/app/services/userService";
import { useState, useEffect } from "react";
import AccountTransactionForm from "@/app/components/transactions/accountTransactionForm";
import { UserAccountService } from "@/app/services/userAccountService";
import { AccountTransactionService } from "@/app/services/accountTransactionService";

export default function AccountEdit({ userId, accountId, transactionId }: { userId: number; accountId: number, transactionId: number }) {
  const [user, setUser] = useState<User>();
  const [account, setAccount] = useState<BankAccount>();
  const [transaction, setTransaction] = useState<AccountTransaction>();
  
  useEffect(() => {
    (async () => {
      setUser(await UserService.getUserById(userId));
      setAccount(await UserAccountService.getUserAccountById(userId, accountId));
      setTransaction(await AccountTransactionService.getAccountTransactionById(transactionId));
    })();
  }, [userId, accountId, transactionId]);  

  return (
    <div>
      {user && account && transaction ? <AccountTransactionForm userId={user.id!} accountId={accountId} accountTransaction={transaction} update /> : <p>Chargement...</p>}
    </div>
  );
}