'use client';

import { Salary } from "@/app/db/schema";
import { useState, useEffect } from "react";
import SalaryForm from "@/app/components/salaries/salaryForm";
import SalaryService from "@/app/services/salaryService";

export default function SalaryEdit({ salaryId }: { salaryId: number }) {
  const [salary, setSalary] = useState<Salary>();
  
  useEffect(() => {
    (async () => {
      setSalary(await SalaryService.getSalaryById(salaryId));
    })();
  }, [salaryId]);  

  return (
    <div>
      {salary ? <SalaryForm salary={salary} update /> : <p>Chargement...</p>}
    </div>
  );
}