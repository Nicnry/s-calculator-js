import { Account } from "@/app/types/account";

const API_URL = process.env.NEXT_PUBLIC_API_URL as string + "/users/1/accounts";

export async function getAccounts(userId: number): Promise<Account[]> {
  const res = await fetch(`${API_URL}/${userId}/accounts`);
  if (!res.ok) throw new Error("Erreur lors de la récupération des salaires");
  return res.json();
}

export async function addAccount(userId: number, account: { amount: number; date: string }): Promise<Account> {
  const res = await fetch(`${API_URL}/${userId}/accounts`, {
    method: "POST",
    body: JSON.stringify(account),
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error("Erreur lors de l'ajout du salaire");
  return res.json();
}

export async function deleteAccount(userId: number, accountId: number | undefined) {
  const res = await fetch(`${API_URL}/${userId}/accounts/${accountId}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Erreur lors de la suppression");
}
