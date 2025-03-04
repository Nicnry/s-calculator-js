import { Account } from "@/app/types/account";

const API_URL = process.env.NEXT_PUBLIC_API_URL as string;

export async function getAccounts(userId: number): Promise<Account[]> {
  try {
    const res = await fetch(`${API_URL}/users/${userId}/accounts`);
    
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Erreur lors de la récupération des comptes pour l'utilisateur ${userId}: ${errorText}`);
    }
    
    return await res.json();
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error during fetch:", error.message);
      throw new Error("Erreur lors du chargement des comptes: " + error.message);
    } else {
      console.error("Erreur inconnue lors de la récupération des comptes");
      throw new Error("Erreur inconnue lors de la récupération des comptes");
    }
  }
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
