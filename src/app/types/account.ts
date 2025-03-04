import { User } from './user';
import { Transaction } from './transaction';

export interface Account {
  id?: number;
  accountType: string;
  bankName: string;
  accountNumber: string;
  balance: number;
  currency: string;
  user: User;
  transactions: Transaction[];
}