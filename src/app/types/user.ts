import { Salary } from "./salary";
import { Account } from "./account";

export interface User {
  id?: number;
  name: string;
  email: string;
  password?: string;
  salaries?: Salary[];
  accounts?: Account[];
}
