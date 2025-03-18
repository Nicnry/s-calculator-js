import { FixedExpense, FixedExpenseTimeStamps } from "@/app/db/schema";
import { localDb } from "@/app/db/database";

export default class FixedExpanseService {
  static async getAllUserExpanses(userId: number): Promise<FixedExpense[]> {
    try {
      await localDb.ensureOpen();
      return await localDb.fixedExpenses.where('userId').equals(userId).toArray();
    } catch (error) {
      console.error('Erreur lors de la récupération des charges', error);
      return [];
    }
  }

  static async getAccountTransactionById(id: number): Promise<FixedExpense> {
    try {
      await localDb.ensureOpen();
      const expanses = await localDb.fixedExpenses.get(id);
      return expanses!;
    } catch (error) {
      console.error('Erreur lors de la récupération du compte', error);
      throw new Error('Compte non trouvé');
    }
  }

  static async addFixedExpense(fixedExpense: FixedExpenseTimeStamps) {
    try {
      await localDb.ensureOpen();
      const id = await localDb.fixedExpenses.add(fixedExpense as unknown as FixedExpense);
      return id;
    } catch (error) {
      console.error("Erreur lors de l'ajout de la charge", error);
      return null;
    }
  }

  static async updateFixedExpanse(id: number, updatedExpanse: Partial<FixedExpense>): Promise<boolean> {
    try {
      await localDb.ensureOpen();
      const expanse = await localDb.fixedExpenses.get(id);
      if (!expanse) {
        console.error('Compte introuvable');
        return false;
      }
      await localDb.fixedExpenses.update(id, { ...updatedExpanse });
      return true;
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'compte", error);
      return false;
    }
  }

  static async deleteExpanse(id: number): Promise<boolean> {
    try {
      await localDb.ensureOpen();
      const expanse = await localDb.fixedExpenses.get(id);
      if (!expanse) {
        console.error('Compte introuvable');
        return false;
      }
      await localDb.fixedExpenses.delete(id);
      return true;
    } catch (error) {
      console.error("Erreur lors de la suppression du compte", error);
      return false;
    }
  }
}
