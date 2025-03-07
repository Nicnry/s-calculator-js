import { Account } from "@/app/types/account";
import { BankAccount } from "@/app/db/schema";
import { localDb } from "@/app/db/database";

const API_URL = process.env.NEXT_PUBLIC_API_URL as string;

export class AccountService {
  static async getAllAccounts(): Promise<BankAccount[]> {
    try {
      await localDb.ensureOpen();
      return await localDb.bankAccounts.toArray();
    } catch (error) {
      console.error('Erreur lors de la récupération des comptes', error);
      return [];
    }
  }

  static async getAccountById(id: number): Promise<BankAccount> {
    try {
      await localDb.ensureOpen();
      const account = await localDb.bankAccounts.get(id);
      return account!;
    } catch (error) {
      console.error('Erreur lors de la récupération du compte', error);
      throw new Error('Compte non trouvé');
    }
  }

  static async addAccount(account: BankAccount) {
    try {
      await localDb.ensureOpen();
      const id = await localDb.bankAccounts.add({ ...account, createdAt: new Date() });
      return id;
    } catch (error) {
      console.error("Erreur lors de l'ajout du compte", error);
      return null;
    }
  }

  static async updateAccount(id: number, updatedAccount: Partial<BankAccount>): Promise<boolean> {
    try {
      await localDb.ensureOpen();
      const account = await localDb.bankAccounts.get(id);
      if (!account) {
        console.error('Compte introuvable');
        return false;
      }
      await localDb.bankAccounts.update(id, { ...updatedAccount });
      return true;
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'compte", error);
      return false;
    }
  }

  static async deleteAccount(id: number): Promise<boolean> {
    try {
      await localDb.ensureOpen();
      const account = await localDb.bankAccounts.get(id);
      if (!account) {
        console.error('Compte introuvable');
        return false;
      }
      await localDb.bankAccounts.delete(id);
      return true;
    } catch (error) {
      console.error("Erreur lors de la suppression du compte", error);
      return false;
    }
  }
}

export async function getAccounts(userId: number): Promise<Account[]> {
  try {
    const res = await fetch(`${API_URL}/users/${userId}/accounts`, { cache: 'no-store' });
    
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Erreur lors de la récupération des comptes pour l'Compte ${userId}: ${errorText}`);
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
