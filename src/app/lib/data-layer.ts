'use client';

import SalaryService from "@/app/services/salaryService";
import { defaultUser, Salary, User } from '@/app/db/schema';
import { UserService } from "../services/userService";

export interface DataSource {
  getUser(userId: number): Promise<User>;
  getAllUserSalaries(userId: number): Promise<Salary[]>;
  getAllSalaries(): Promise<Salary[]>;
  getSalaryById(id: number): Promise<Salary>;
  addSalary(salary: Salary): Promise<number | null>;
  updateSalary(id: number, updatedSalary: Partial<Salary>): Promise<boolean>;
  deleteSalary(id: number): Promise<boolean>;
  calculateAdjustedSalary(salary: Salary): number;
  calculateAdjustedTaxableSalary(salary: Salary): number;
}

export class IndexedDBDataSource implements DataSource {
  async getUser(userId: number): Promise<User> {
    return await UserService.getUserById(userId);
  }

  async getAllUserSalaries(userId: number): Promise<Salary[]> {
    return await SalaryService.getAllUserSalaries(userId);
  }
  
  async getAllSalaries(): Promise<Salary[]> {
    return await SalaryService.getAllSalaries();
  }
  
  async getSalaryById(id: number): Promise<Salary> {
    return await SalaryService.getSalaryById(id);
  }
  
  async addSalary(salary: Salary): Promise<number | null> {
    return await SalaryService.addSalary(salary);
  }
  
  async updateSalary(id: number, updatedSalary: Partial<Salary>): Promise<boolean> {
    return await SalaryService.updateSalary(id, updatedSalary);
  }
  
  async deleteSalary(id: number): Promise<boolean> {
    return await SalaryService.deleteSalary(id);
  }
  
  calculateAdjustedSalary(salary: Salary): number {
    return SalaryService.calculateAdjustedSalary(salary);
  }
  
  calculateAdjustedTaxableSalary(salary: Salary): number {
    return SalaryService.calculateAdjustedTaxableSalary(salary);
  }
}

export class ApiDataSource implements DataSource {
  async getUser(userId: number): Promise<User> {
    try {
      const response = await fetch(`/api/users/${userId}/salaries`);
      if (!response.ok) throw new Error('Erreur réseau');
      return await response.json();
    } catch (error) {
      console.error('Erreur API:', error);
      return defaultUser();
    }
  }

  async getAllUserSalaries(userId: number): Promise<Salary[]> {
    try {
      const response = await fetch(`/api/users/${userId}/salaries`);
      if (!response.ok) throw new Error('Erreur réseau');
      return await response.json();
    } catch (error) {
      console.error('Erreur API:', error);
      return [];
    }
  }
  
  async getAllSalaries(): Promise<Salary[]> {
    try {
      const response = await fetch('/api/salaries');
      if (!response.ok) throw new Error('Erreur réseau');
      return await response.json();
    } catch (error) {
      console.error('Erreur API:', error);
      return [];
    }
  }
  
  async getSalaryById(id: number): Promise<Salary> {
    try {
      const response = await fetch(`/api/salaries/${id}`);
      if (!response.ok) throw new Error('Erreur réseau');
      return await response.json();
    } catch (error) {
      console.error('Erreur API:', error);
      throw new Error('Salaire non trouvé');
    }
  }
  
  async addSalary(salary: Salary): Promise<number | null> {
    try {
      const response = await fetch('/api/salaries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(salary)
      });
      if (!response.ok) throw new Error('Erreur réseau');
      const data = await response.json();
      return data.id;
    } catch (error) {
      console.error('Erreur API:', error);
      return null;
    }
  }
  
  async updateSalary(id: number, updatedSalary: Partial<Salary>): Promise<boolean> {
    try {
      const response = await fetch(`/api/salaries/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedSalary)
      });
      return response.ok;
    } catch (error) {
      console.error('Erreur API:', error);
      return false;
    }
  }
  
  async deleteSalary(id: number): Promise<boolean> {
    try {
      const response = await fetch(`/api/salaries/${id}`, {
        method: 'DELETE'
      });
      return response.ok;
    } catch (error) {
      console.error('Erreur API:', error);
      return false;
    }
  }
  
  calculateAdjustedSalary(salary: Salary): number {
    return (salary.totalSalary / 100) * salary.employmentRate;
  }
  
  calculateAdjustedTaxableSalary(salary: Salary): number {
    return (salary.taxableSalary / 100) * salary.employmentRate;
  }
}

export function getDataSource(type: 'indexeddb' | 'api' = 'indexeddb'): DataSource {
  if (typeof window === 'undefined') {
    throw new Error('getDataSource ne peut pas être appelé côté serveur');
  }
  
  if (type === 'api') {
    return new ApiDataSource();
  }
  
  return new IndexedDBDataSource();
}

export async function isApiAvailable(): Promise<boolean> {
  try {
    const response = await fetch('/api/health', { 
      method: 'HEAD',
      cache: 'no-store'
    });
    return response.ok;
  } catch (error) {
    console.error('API not available:', error);
    return false;
  }
}