import { Salary } from "@/db/schema";
import { localDb } from "@/db/database";

export default class SalaryService {
  static async getAllUserSalaries(userId: number): Promise<Salary[]> {
    try {
      await localDb.ensureOpen();
      return await localDb.salaries.where('userId').equals(userId).toArray();
    } catch (error) {
      console.error('Erreur lors de la récupération des salaires', error);
      return [];
    }
  }

  static async getAllSalaries(): Promise<Salary[]> {
    try {
      await localDb.ensureOpen();
      return await localDb.salaries.toArray();
    } catch (error) {
      console.error('Erreur lors de la récupération des salaires', error);
      return [];
    }
  }

  static async getSalaryById(id: number): Promise<Salary> {
    try {
      await localDb.ensureOpen();
      const salary = await localDb.salaries.get(id);
      return salary!;
    } catch (error) {
      console.error('Erreur lors de la récupération du salaire', error);
      throw new Error('Compte non trouvé');
    }
  }

  static async addSalary(salary: Salary) {
    try {
      await localDb.ensureOpen();
      const id = await localDb.salaries.add({ ...salary, createdAt: new Date() });
      return id;
    } catch (error) {
      console.error("Erreur lors de l'ajout du compte", error);
      return null;
    }
  }

  static async updateSalary(id: number, updatedSalary: Partial<Salary>): Promise<boolean> {
    try {
      await localDb.ensureOpen();
      const salary = await localDb.salaries.get(id);
      if (!salary) {
        console.error('Salaire introuvable');
        return false;
      }
      await localDb.salaries.update(id, { ...updatedSalary });
      return true;
    } catch (error) {
      console.error("Erreur lors de la mise à jour du salaire", error);
      return false;
    }
  }

  static async deleteSalary(id: number): Promise<boolean> {
    try {
      await localDb.ensureOpen();
      const account = await localDb.salaries.get(id);
      if (!account) {
        console.error('Salaire introuvable');
        return false;
      }
      await localDb.salaries.delete(id);
      return true;
    } catch (error) {
      console.error("Erreur lors de la suppression du salaire", error);
      return false;
    }
  }

  static calculateAdjustedSalary(salary: Salary): number {
    return (salary.totalSalary / 100) * salary.employmentRate;
  }

  static calculateAdjustedTaxableSalary(salary: Salary): number {
    return (salary.taxableSalary / 100) * salary.employmentRate;
  }
}
