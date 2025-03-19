import { FixedExpense, FixedExpenseTimeStamps } from "@/app/db/schema";
import { localDb } from "@/app/db/database";

export default class FixedExpenseService {
  static async getAllUserExpenses(userId: number): Promise<FixedExpense[]> {
    try {
      await localDb.ensureOpen();
      return await localDb.fixedExpenses.where('userId').equals(userId).toArray();
    } catch (error) {
      console.error('Erreur lors de la récupération des charges', error);
      return [];
    }
  }

  static async getUserFixedExpenseById(id: number): Promise<FixedExpense> {
    try {
      await localDb.ensureOpen();
      const expenses = await localDb.fixedExpenses.get(id);
      return expenses!;
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

  static async updateFixedExpense(id: number, updatedExpense: Partial<FixedExpense>): Promise<boolean> {
    try {
      await localDb.ensureOpen();
      const expense = await localDb.fixedExpenses.get(id);
      if (!expense) {
        console.error('Compte introuvable');
        return false;
      }
      await localDb.fixedExpenses.update(id, { ...updatedExpense });
      return true;
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'compte", error);
      return false;
    }
  }

  static async deleteExpense(id: number): Promise<boolean> {
    try {
      await localDb.ensureOpen();
      const expense = await localDb.fixedExpenses.get(id);
      if (!expense) {
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
