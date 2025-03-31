'use client';

import { AccountTransaction, BankAccount, User } from "@/db/schema";
import { UserService } from "@/services/userService";
import { useState, useEffect } from "react";
import AccountTransactionForm from "@/components/transactions/accountTransactionForm";
import { UserAccountService } from "@/services/userAccountService";
import { AccountTransactionService } from "@/services/accountTransactionService";

export default function AccountEdit({ userId, accountId, transactionId }: AccountEditProps) {
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

type AccountEditProps = {
  userId: number;
  accountId: number;
  transactionId: number;
}