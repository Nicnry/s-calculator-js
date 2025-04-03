export type User = {
  id?: number;
  name: string;
  email: string;
  password: string;
  salaries?: Salary[];
  accounts?: BankAccount[];
  createdAt?: Date;
  updatedAt?: Date;
}

export type BankAccount = {
  id?: number;
  userId: number;
  bankName: string;
  accountNumber: string;
  accountType: string;
  balance: number;
  currency: string;
  from: Date;
  to: Date;
  createdAt?: Date;
}

export type AccountTransaction = {
  id?: number;
  bankAccountId: number;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  date: Date;
  description?: string;
  createdAt?: Date;
}


export type Salary = {
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
  from: Date;
  to?: Date;
  createdAt?: Date;
}

export type FixedExpenseCreate = {
  userId: number;
  title: string;
  amount: number;
  category: string;
  date: string;
  recurrence: 'quotidienne' | 'hebdomadaire' | 'mensuelle' | 'annuelle' | 'ponctuelle';
  paid?: boolean;
  paymentMethod?: 'Carte' | 'Virement' | 'Prélèvement' | 'Espèces' | 'Autre';
  from: Date;
  to: Date;
  endDate?: string;
}


export type FixedExpenseTimeStamps = FixedExpenseCreate & {
  createdAt: Date;
  updatedAt: Date;
}

export type FixedExpense = FixedExpenseCreate & {
  id: number;
}

export function defaultFixedExpense(): Omit<FixedExpense, "id" | "userId"> {
  return {
    title: 'Loyer',
    amount: 800,
    category: 'Appartement',
    date: new Date().toISOString().split('T')[0],
    recurrence: 'mensuelle',
    paid: false,
    paymentMethod: 'Virement',
    from: new Date(),
    to: new Date(),
  };
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
  const { today } = getTodayAndNextYear();

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
    from: today,
    createdAt: today,
  };
}

export function defaultAccount(): Omit<BankAccount, "userId"> {
  const { today, nextYear } = getTodayAndNextYear();

  return {
    bankName: "",
    accountNumber: "",
    accountType: "",
    balance: 0,
    from: today,
    to: nextYear,
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

const getTodayAndNextYear = (): { today: Date; nextYear: Date } => {
  const today = new Date();
  const nextYear = new Date(today);
  nextYear.setFullYear(today.getFullYear() + 1);
  return { today, nextYear };
};