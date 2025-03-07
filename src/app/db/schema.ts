export interface User {
  id?: number;
  name: string;
  email: string;
  salaries?: Salary[];
  accounts?: BankAccount[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface BankAccount {
  id?: number;
  userId: number;
  bankName: string;
  accountNumber: string;
  accountType: string;
  balance: number;
  currency: string;
  createdAt?: Date;
}

export interface Transaction {
  id?: number;
  bankAccountId: number;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  date: Date;
  description?: string;
}

export interface Salary {
  id?: number;
  userId: number;
  totalSalary: number;
  taxableSalary: number;
  avsAiApgContribution: number;
  vdLpcfamDeduction: number;
  acDeduction: number;
  aanpDeduction: number;
  ijmA1Deduction: number;
  lppDeduction: number;
  createdAt?: Date;
}