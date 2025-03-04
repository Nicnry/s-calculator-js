"use client";

import { useState } from "react";
import { addSalary } from "@/app/services/salaryService";

export default function SalaryForm({ userId }: { userId: number }) {
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await addSalary(userId, { amount: Number(amount), date });
      setAmount("");
      setDate("");
      alert("Salaire ajouté !");
    } catch (error) {
      console.error(error);
      alert("Erreur lors de l'ajout !");
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="number"
        placeholder="Montant (€)"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />
      <button type="submit">Ajouter</button>
    </form>
  );
}
