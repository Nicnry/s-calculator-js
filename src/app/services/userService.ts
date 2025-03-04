import { User } from "@/app/types/user";

const API_URL = process.env.NEXT_PUBLIC_API_URL as string + "/users";

export async function getUsers(): Promise<User[]>  {
  const res = await fetch(`${API_URL}`);
  if (!res.ok) throw new Error("Erreur lors de la récupération des utilisateurs");
  return res.json();
}

export async function getUserById(userId: number) {
  const res = await fetch(`${API_URL}/${userId}`);
  if (!res.ok) throw new Error("Utilisateur non trouvé");
  return res.json();
}

export async function addUser(user: { name: string; email: string }): Promise<User> {
  const res = await fetch(`${API_URL}`, {
    method: "POST",
    body: JSON.stringify(user),
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error("Erreur lors de l'ajout de l'utilisateur");
  return res.json();
}

export async function updateUser(userId: number | undefined, user: { name?: string; email?: string }): Promise<User> {
  const res = await fetch(`${API_URL}/${userId}`, {
    method: "PATCH",
    body: JSON.stringify(user),
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error("Erreur lors de la mise à jour");
  return res.json();
}

export async function deleteUser(userId: number | undefined) {
  const res = await fetch(`${API_URL}/${userId}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Erreur lors de la suppression");
}
