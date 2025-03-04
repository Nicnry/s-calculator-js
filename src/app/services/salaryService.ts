import { Salary } from "@/app/types/salary";

const API_URL = process.env.NEXT_PUBLIC_API_URL as string + "/users/1/salaries";

export async function getSalaries(userId: number): Promise<Salary[]> {
  const res = await fetch(`${API_URL}/${userId}/salaries`);
  if (!res.ok) throw new Error("Erreur lors de la récupération des salaires");
  return res.json();
}

export async function addSalary(userId: number, salary: { amount: number; date: string }): Promise<Salary> {
  const res = await fetch(`${API_URL}/${userId}/salaries`, {
    method: "POST",
    body: JSON.stringify(salary),
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error("Erreur lors de l'ajout du salaire");
  return res.json();
}

export async function deleteSalary(userId: number, salaryId: number) {
  const res = await fetch(`${API_URL}/${userId}/salaries/${salaryId}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Erreur lors de la suppression");
}
