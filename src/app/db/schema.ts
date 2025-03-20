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

export interface AccountTransaction {
  id?: number;
  bankAccountId: number;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  date: Date;
  description?: string;
  createdAt?: Date;
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
  employmentRate: number;
  createdAt?: Date;
}

export interface FixedExpenseCreate {
  userId: number;
  title: string;
  amount: number;
  category: string;
  date: string;
  recurrence: 'quotidienne' | 'hebdomadaire' | 'mensuelle' | 'annuelle' | 'ponctuelle';
  paid?: boolean;
  paymentMethod?: 'Carte' | 'Virement' | 'Prélèvement' | 'Espèces' | 'Autre';
  endDate?: string;
}


export interface FixedExpenseTimeStamps extends FixedExpenseCreate {
  createdAt: Date;
  updatedAt: Date;
}

export interface FixedExpense extends FixedExpenseCreate {
  id: number;
}


export function defaultAccountTransaction(): Omit<AccountTransaction, "id" | "bankAccountId"> {
  return {
    amount: 0,
    type: 'income',
    category: 'Autre',
    date: new Date(),
    description: '',
    createdAt: new Date(),
  };
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
    employmentRate: 100,
    createdAt: new Date(),
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