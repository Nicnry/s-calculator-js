'use client';

import { Salary, User } from "@/app/db/schema";
import { UserService } from "@/app/services/userService";
import { useState, useEffect } from "react";
import SalaryForm from "@/app/components/salaries/salaryForm";
import { SalaryService } from "@/app/services/salaryService";

export default function SalaryEdit({ userId, salaryId }: { userId: number; salaryId: number }) {
  const [user, setUser] = useState<User>();
  const [salary, setSalary] = useState<Salary>();
  
  useEffect(() => {
    (async () => {
      setUser(await UserService.getUserById(userId));
      setSalary(await SalaryService.getSalaryById(salaryId));
    })();
  }, [userId, salaryId]);  

  return (
    <div>
      {user && salary ? <SalaryForm userId={user.id!} salary={salary} update /> : <p>Chargement...</p>}
    </div>
  );
}