import { AccountTransaction } from "@/db/schema";
import { localDb } from "@/db/database";

export class TransactionService {
  static async getAllTransactions(): Promise<AccountTransaction[]> {
    try {
      await localDb.ensureOpen();
      return await localDb.accountTransactions.toArray();
    } catch (error) {
      console.error('Erreur lors de la récupération des transactions', error);
      return [];
    }
  }
}
