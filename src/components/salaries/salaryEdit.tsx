'use client';

import { Salary } from "@/db/schema";
import { useState, useEffect } from "react";
import SalaryForm from "@/components/salaries/salaryForm";
import SalaryService from "@/services/salaryService";

export default function SalaryEdit({ salaryId }: SalaryEditProps) {
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

type SalaryEditProps = {
  salaryId: number;
}