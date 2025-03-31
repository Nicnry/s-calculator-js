import { AccountTransaction } from "@/db/schema";
import { localDb } from "@/db/database";

export class AccountTransactionService {
  static async getAllAccountTransactions(accountId: number): Promise<AccountTransaction[]> {
    try {
      await localDb.ensureOpen();
      return await localDb.accountTransactions.where('bankAccountId').equals(accountId).toArray();
    } catch (error) {
      console.error('Erreur lors de la récupération des transactions', error);
      return [];
    }
  }

  static async getAccountTransactionById(id: number): Promise<AccountTransaction> {
    try {
      await localDb.ensureOpen();
      const account = await localDb.accountTransactions.get(id);
      return account!;
    } catch (error) {
      console.error('Erreur lors de la récupération du compte', error);
      throw new Error('Compte non trouvé');
    }
  }

  static async addAccountTransaction(accountTransaction: AccountTransaction) {
    try {
      await localDb.ensureOpen();
      const id = await localDb.accountTransactions.add({ ...accountTransaction, createdAt: new Date() });
      return id;
    } catch (error) {
      console.error("Erreur lors de l'ajout du compte", error);
      return null;
    }
  }

  static async updateAccountTransaction(id: number, updatedAccount: Partial<AccountTransaction>): Promise<boolean> {
    try {
      await localDb.ensureOpen();
      const accountTransaction = await localDb.accountTransactions.get(id);
      if (!accountTransaction) {
        console.error('Compte introuvable');
        return false;
      }
      await localDb.accountTransactions.update(id, { ...updatedAccount });
      return true;
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'compte", error);
      return false;
    }
  }

  static async deleteAccountTransaction(id: number): Promise<boolean> {
    try {
      await localDb.ensureOpen();
      const accountTransaction = await localDb.accountTransactions.get(id);
      if (!accountTransaction) {
        console.error('Compte introuvable');
        return false;
      }
      await localDb.accountTransactions.delete(id);
      return true;
    } catch (error) {
      console.error("Erreur lors de la suppression du compte", error);
      return false;
    }
  }
}
