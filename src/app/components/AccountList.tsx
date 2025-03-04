"use client";

import { useEffect, useState } from "react";
import { getAccounts, deleteAccount } from "@/app/services/accountService";
import { Account } from "../types/account";

export default function AccountList({ userId }: { userId: number }) {
  const [accounts, setAccounts] = useState<Account[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getAccounts(userId);
        setAccounts(data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchData();
  }, [userId]);

  async function handleDelete(accountId: number | undefined) {
    try {
      await deleteAccount(userId, accountId);
      setAccounts(accounts.filter((a) => a.id !== accountId));
    } catch (error) {
      console.error(error);
      alert("Erreur lors de la suppression du salaire");
    }
  }

  return (
    <div>
      <h2>Comptes</h2>
      <ul>
        {accounts.map((account: Account) => (
          <li key={account.id}>
            {account.bankName}€ - {account.balance}
            <button onClick={() => handleDelete(account.id)}>Supprimer</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
