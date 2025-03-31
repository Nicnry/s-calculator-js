import { BankAccount } from "@/db/schema";
import { localDb } from "@/db/database";

export class AccountService {
  static async getAllUserAccounts(userId: number): Promise<BankAccount[]> {
    try {
      await localDb.ensureOpen();
      return await localDb.bankAccounts.where('userId').equals(userId).toArray();
    } catch (error) {
      console.error('Erreur lors de la récupération des comptes', error);
      return [];
    }
  }

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
