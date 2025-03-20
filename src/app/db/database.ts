import Dexie from 'dexie';
import { User, BankAccount, Salary, AccountTransaction, FixedExpense } from './schema';

export class LocalDatabase extends Dexie {
  users: Dexie.Table<User, number>;
  bankAccounts: Dexie.Table<BankAccount, number>;
  salaries: Dexie.Table<Salary, number>;
  accountTransactions: Dexie.Table<AccountTransaction, number>;
  fixedExpenses: Dexie.Table<FixedExpense, number>;

  constructor() {
    super('SCalculator');
    
    this.version(1).stores({
      users: '++id, name, email, createdAt',
      bankAccounts: '++id, userId, bankName, accountNumber, accountType, balance, currency, createdAt',
      salaries: '++id, userId, totalSalary, taxableSalary, avsAiApgContribution, vdLpcfamDeduction, acDeduction, aanpDeduction, ijmA1Deduction, lppDeduction, monthlyPayments, employmentRate, createdAt',
      accountTransactions: '++id, bankAccountId, amount, type, category, date, description, createdAt',
      fixedExpenses: '++id, userId, title, amount, category, date, recurrence, paid, paymentMethod, endDate'
    });

    this.users = this.table('users');
    this.bankAccounts = this.table('bankAccounts');
    this.salaries = this.table('salaries');
    this.accountTransactions = this.table('accountTransactions');
    this.fixedExpenses = this.table('fixedExpenses');
  }

  async ensureOpen(): Promise<void> {
    if (!this.isOpen()) {
      try {
        await this.open();
      } catch (error) {
        console.error("Erreur lors de l'ouverture de la base de données :", error);
      }
    }
  }

}

export const localDb = new LocalDatabase();