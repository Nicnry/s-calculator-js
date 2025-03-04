import { Salary } from "@/app/types/salary";

const API_URL = process.env.NEXT_PUBLIC_API_URL as string;

export async function getSalaries(userId: number): Promise<Salary[]> {
  try {
    const res = await fetch(`${API_URL}/users/${userId}/salaries`);
    
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Erreur lors de la récupération des salaires pour l'utilisateur ${userId}: ${errorText}`);
    }
    
    return await res.json();
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error during fetch:", error.message);
      throw new Error("Erreur lors du chargement des salaires: " + error.message);
    } else {
      console.error("Erreur inconnue lors de la récupération des salaires");
      throw new Error("Erreur inconnue lors de la récupération des salaires");
    }
  }
}


export async function addSalary(userId: number, salary: { amount: number; date: string }): Promise<Salary> {
  const res = await fetch(`${API_URL}/users/${userId}/salaries`, {
    method: "POST",
    body: JSON.stringify(salary),
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error("Erreur lors de l'ajout du salaire");
  return res.json();
}

export async function deleteSalary(userId: number, salaryId: number) {
  const res = await fetch(`${API_URL}/users/${userId}/salaries/${salaryId}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Erreur lors de la suppression");
}
