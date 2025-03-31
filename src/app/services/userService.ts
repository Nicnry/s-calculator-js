import { localDb } from '@/app/db/database';
import { User } from '@/app/db/schema';

export class UserService {
  static async getAllUsers(): Promise<User[]> {
    try {
      await localDb.ensureOpen();
      return await localDb.users.toArray();
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs', error);
      return [];
    }
  }

  static async getUserById(id: number): Promise<User> {
    try {
      await localDb.ensureOpen();
      const user = await localDb.users.get(id);
      return user!;
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs', error);
      throw new Error('Utilisateur non trouvé');
    }
  }

  static async addUser(user: User) {
    try {
      await localDb.ensureOpen();
      const id = await localDb.users.add({ ...user, createdAt: new Date() });
      return id;
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'utilisateur", error);
      return null;
    }
  }

  static async updateUser(id: number, updatedUser: Partial<User>): Promise<boolean> {
    try {
      const user = await this.getUserById(id);
      if (!user) {
        console.error('Utilisateur introuvable');
        return false;
      }
      await localDb.users.update(id, { ...updatedUser, updatedAt: new Date() });
      return true;
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'utilisateur", error);
      return false;
    }
  }

  static async deleteUser(id: number): Promise<boolean> {
    try {
      const user = await this.getUserById(id);
      if (!user) {
        console.error('Utilisateur introuvable');
        return false;
      }
      await localDb.users.delete(id);
      await localDb.bankAccounts.where('userId').equals(id).delete();
      await localDb.salaries.where('userId').equals(id).delete();
      await localDb.fixedExpenses.where('userId').equals(id).delete();
      return true;
    } catch (error) {
      console.error("Erreur lors de la suppression de l'utilisateur", error);
      return false;
    }
  }
}

const API_URL = process.env.NEXT_PUBLIC_API_URL as string + "/users";

export async function getUsers(): Promise<User[]>  {
  try {
    const res = await fetch(`${API_URL}`, { 
      next: { 
        revalidate: 60,
        tags: ['users']
      },
      cache: "no-store"
    });
    if (!res.ok) {
      throw new Error("Erreur lors de la récupération des utilisateurs");
    }
    return await res.json();
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error during fetch:", error.message);
      throw new Error("Erreur lors du chargement des utilisateurs: " + error.message);
    } else {
      console.error("Erreur inconnue lors de la récupération des utilisateurs");
      throw new Error("Erreur inconnue lors de la récupération des utilisateurs");
    }
  }
}

export async function getUserById(userId: number) {
  const res = await fetch(`${API_URL}/${userId}`);
  if (!res.ok) throw new Error("Utilisateur non trouvé");
  return res.json();
}

export async function addUser(user: { name: string; email: string }): Promise<User> {
  const res = await fetch(`${API_URL}`, {
    method: "POST",
    body: JSON.stringify(user),
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error("Erreur lors de l'ajout de l'utilisateur");
  return res.json();
}

export async function updateUser(userId: number | undefined, user: { name?: string; email?: string }): Promise<User> {
  const res = await fetch(`${API_URL}/${userId}`, {
    method: "PATCH",
    body: JSON.stringify(user),
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error("Erreur lors de la mise à jour");
  return res.json();
}

export async function deleteUser(userId: number | undefined) {
  const res = await fetch(`${API_URL}/${userId}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Erreur lors de la suppression");
}
