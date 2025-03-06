
import { localDb } from '../database';
import { User } from '../schema';

export class UserModel {
    static async create(userData: Omit<User, 'id' | 'createdAt'>) {
      return localDb.users.add({
        ...userData,
        createdAt: new Date()
      });
    }
  
    static async getById(id: number) {
      return localDb.users.get(id);
    }
  
    static async getAll() {
      return localDb.users.toArray();
    }
  
    static async update(id: number, updateData: Partial<User>) {
      return localDb.users.update(id, updateData);
    }
  
    static async delete(id: number) {
      return localDb.users.delete(id);
    }
  }