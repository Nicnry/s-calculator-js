'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addUser, updateUser } from "@/app/services/userService";
import { User } from "@/app/types/user";

export default function UserForm({ user }: { user?: User }) {
  const router = useRouter();
  const [formData, setFormData] = useState(user || { name: "", email: "", password: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (user) {
        await updateUser(user.id, formData);
      } else {
        await addUser(formData);
      }
      router.replace("/users");
      router.refresh();
    } catch (error) {
      console.error("Erreur lors de l'enregistrement", error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-xl overflow-hidden p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">{user ? "Modifier l'utilisateur" : "Créer un utilisateur"}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col">
          <label className="text-sm font-semibold text-gray-600">Nom complet</label>
          <input 
            type="text" 
            name="name" 
            placeholder="Nom" 
            value={formData.name} 
            onChange={handleChange} 
            required 
            className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-semibold text-gray-600">Adresse email</label>
          <input 
            type="email" 
            name="email" 
            placeholder="Email" 
            value={formData.email} 
            onChange={handleChange} 
            required 
            className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-semibold text-gray-600">Mot de passe</label>
          <input 
            type="password" 
            name="password" 
            placeholder="Mot de passe" 
            value={formData.password} 
            onChange={handleChange} 
            className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button 
          type="submit" 
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors w-full"
        >
          {user ? "Modifier" : "Créer"}
        </button>
      </form>
    </div>
  );
}
