'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Salary } from "@/app/db/schema";
import { SalaryService } from "@/app/services/salaryService";

export default function SalaryForm({ salary }: { salary?: Salary }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    userId: 1,
    totalSalary: salary?.totalSalary || 5000,
    taxableSalary: salary?.taxableSalary || 5000,
    avsAiApgContribution: salary?.avsAiApgContribution || 5.3,
    vdLpcfamDeduction: salary?.vdLpcfamDeduction || 0.06,
    acDeduction: salary?.acDeduction || 1.1,
    aanpDeduction: salary?.aanpDeduction || 0.4528,
    ijmA1Deduction: salary?.ijmA1Deduction || 0.5265,
    lppDeduction: salary?.lppDeduction || 261.95,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.totalSalary || !formData.totalSalary) {
      console.log(formData);
      alert("Le nom et l'email sont obligatoires");
      return;
    }

    setLoading(true);
    try {
      const newSalary: Salary = {
        userId: 1,
        totalSalary: Number(formData.totalSalary),
        taxableSalary: Number(formData.taxableSalary),
        avsAiApgContribution: Number(formData.avsAiApgContribution),
        vdLpcfamDeduction: Number(formData.vdLpcfamDeduction),
        acDeduction: Number(formData.acDeduction),
        aanpDeduction: Number(formData.aanpDeduction),
        ijmA1Deduction: Number(formData.ijmA1Deduction),
        lppDeduction: Number(formData.lppDeduction),
        createdAt: new Date(),
      };

      await SalaryService.addSalary(newSalary);
      router.push("/users/1/salaries");
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'utilisateur", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-xl overflow-hidden p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        {salary ? "Modifier le salaire" : "Créer un salaire"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col">
          <label className="text-sm font-semibold text-gray-600">Salaire brute</label>
          <input 
            type="number" 
            name="totalSalary" 
            value={formData.totalSalary}
            onChange={handleChange}
            required 
            className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-semibold text-gray-600">Salaire taxable</label>
          <input 
            type="number" 
            name="taxableSalary" 
            value={formData.taxableSalary}
            onChange={handleChange}
            required 
            className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-semibold text-gray-600">Cotisation AVS</label>
          <input 
            type="number" 
            name="avsAiApgContribution" 
            value={formData.avsAiApgContribution}
            onChange={handleChange}
            required 
            className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-semibold text-gray-600">Cotisation LPC FAM</label>
          <input 
            type="number" 
            name="vdLpcfamDeduction" 
            value={formData.vdLpcfamDeduction}
            onChange={handleChange}
            required
            className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-semibold text-gray-600">Cotisation chomage</label>
          <input 
            type="number" 
            name="acDeduction" 
            value={formData.acDeduction}
            onChange={handleChange}
            required
            className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-semibold text-gray-600">Cotisation AANP</label>
          <input 
            type="number" 
            name="aanpDeduction" 
            value={formData.aanpDeduction}
            onChange={handleChange}
            required
            className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-semibold text-gray-600">Cotisation IJMA1</label>
          <input 
            type="number" 
            name="ijmA1Deduction" 
            value={formData.ijmA1Deduction}
            onChange={handleChange}
            required
            className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-semibold text-gray-600">Cotisation LPP</label>
          <input 
            type="number" 
            name="lppDeduction" 
            value={formData.lppDeduction}
            onChange={handleChange}
            required
            className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex justify-between mt-4">
          <button 
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors w-1/2 mr-2"
          >
            {loading ? "Création..." : "Créer"}
          </button>
          <button 
            type="button"
            onClick={() => router.back()}
            className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition-colors w-1/2 ml-2"
          >
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
}
