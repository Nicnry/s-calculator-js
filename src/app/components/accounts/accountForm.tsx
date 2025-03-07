'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BankAccount } from "@/app/db/schema";
import { AccountService } from "@/app/services/accountService";

export default function AccountForm({ account }: { account?: BankAccount }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    userId: 1,
    bankName: account?.bankName || "",
    accountNumber: account?.accountNumber || "",
    accountType: account?.accountType || "",
    balance: account?.balance || "",
    currency: account?.currency || "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.bankName || !formData.bankName) {
      alert("Le nom et l'email sont obligatoires");
      return;
    }

    setLoading(true);
    try {
      const newAccount: BankAccount = {
        userId: 1,
        bankName: formData.bankName,
        accountNumber: formData.accountNumber,
        accountType: formData.accountType,
        balance: Number(formData.balance),
        currency: formData.currency,
        createdAt: new Date(),
      };

      await AccountService.addAccount(newAccount);
      router.push("/users/1/accounts");
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'utilisateur", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-xl overflow-hidden p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        {account ? "Modifier le compte" : "Créer un compte"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col">
          <label className="text-sm font-semibold text-gray-600">Nom banque</label>
          <input 
            type="text" 
            name="bankName" 
            value={formData.bankName}
            onChange={handleChange}
            required 
            className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-semibold text-gray-600">No compte</label>
          <input 
            type="test" 
            name="accountNumber" 
            value={formData.accountNumber}
            onChange={handleChange}
            required 
            className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-semibold text-gray-600">Type de compte</label>
          <input 
            type="text" 
            name="accountType" 
            value={formData.accountType}
            onChange={handleChange}
            className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-semibold text-gray-600">Montant</label>
          <input 
            type="text" 
            name="balance" 
            value={formData.balance}
            onChange={handleChange}
            className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-semibold text-gray-600">Monnaie</label>
          <input 
            type="text" 
            name="currency" 
            value={formData.currency}
            onChange={handleChange}
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
