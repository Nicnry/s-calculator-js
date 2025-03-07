export interface User {
  id?: number;
  name: string;
  email: string;
  password: string;
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
  monthlyPayments: number;
  createdAt?: Date;
}

export function defaultSalary(): Omit<Salary, "userId"> {
  return {
    totalSalary: 5000,
    taxableSalary: 5000,
    avsAiApgContribution: 5.3,
    vdLpcfamDeduction: 0.06,
    acDeduction: 1.1,
    aanpDeduction: 0.4528,
    ijmA1Deduction: 0.5265,
    lppDeduction: 261.95,
    monthlyPayments: 12,
    createdAt: new Date,
  };
}

export function defaultAccount(): Omit<BankAccount, "userId"> {
  return {
    bankName: "",
    accountNumber: "",
    accountType: "",
    balance: 0,
    currency: "",
  }
}

export function defaultUser(): User {
  return {
    name: "",
    email: "",
    password: "",
  }
}