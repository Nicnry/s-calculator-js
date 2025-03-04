"use client";

import { useEffect, useState } from "react";
import { getSalaries, deleteSalary } from "@/app/services/salaryService";
import { Salary } from "../types/salary";

export default function SalaryList({ userId }: { userId: number }) {
  const [salaries, setSalaries] = useState<Salary[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getSalaries(userId);
        setSalaries(data);
      } catch (error) {
        console.error(error);
        setError("Impossible de charger les salaires. Veuillez réessayer plus tard.");
      }
    }
    fetchData();
  }, [userId]);

  async function handleDelete(salaryId: number) {
    try {
      await deleteSalary(userId, salaryId);
      setSalaries(salaries.filter((s) => s.id !== salaryId));
    } catch (error) {
      console.error(error);
      alert("Erreur lors de la suppression du salaire");
    }
  }

  return (
    <div>
      <h2>Salaires</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <ul>
        {salaries.map((salary) => (
          <li key={salary.id}>
            {salary.amount}€ - {salary.date}
            <button onClick={() => handleDelete(salary.id)}>Supprimer</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
