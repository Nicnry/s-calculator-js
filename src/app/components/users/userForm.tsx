'use client';

import { UserService } from "@/app/services/userService";
import { User, defaultUser } from "@/app/db/schema";
import FormComponent from "@/app/components/global/FormComponent";
import FormField from "@/app/types/formField";

export default function UserForm({ user }: { user?: User }) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { salaries, accounts, ...initialData } = { ...defaultUser(), ...user };

  const fields: FormField[] = [
    { name: "name", label: "Nom complet" },
    { name: "email", label: "Adresse email", type: "email" },
    { name: "password", label: "Mot de passe", type: "password" },
  ];

  const onSubmit = async (data: User) => {
    await UserService.addUser({ ...data, createdAt: new Date() });
  };

  return <FormComponent initialData={initialData} fields={fields} onSubmit={onSubmit} title="Créer un utilisateur" />;
}
