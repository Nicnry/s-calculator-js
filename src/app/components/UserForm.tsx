"use client";

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
      router.push("/users");
    } catch (error) {
      console.error("Erreur lors de l'enregistrement", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <input type="text" name="name" placeholder="Nom" value={formData.name} onChange={handleChange} required />
      <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
      <input type="password" name="password" placeholder="Mot de passe" value={formData.password} onChange={handleChange} />
      <button type="submit" className="bg-blue-500 text-white p-2 rounded">
        {user ? "Modifier" : "Créer"}
      </button>
    </form>
  );
}
