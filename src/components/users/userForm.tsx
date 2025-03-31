'use client';

import { UserService } from "@/services/userService";
import { User, defaultUser } from "@/db/schema";
import FormComponent from "@/components/global/FormComponent";
import FormField from "@/types/formField";
import { Mail, User as UserIcon, RectangleEllipsis } from "lucide-react";

export default function UserForm({ user, update = false }: UserFormProps) {

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { salaries, accounts, ...initialData } = { ...defaultUser(), ...user };

  const fields: FormField[] = [
    { name: "name", label: "Nom complet", icon: <UserIcon/> },
    { name: "email", label: "Adresse email", type: "email", icon: <Mail/> },
    { name: "password", label: "Mot de passe", type: "password", icon: <RectangleEllipsis/> },
  ];

  const onSubmit = async (data: User) => {
    if(update) {
      await UserService.updateUser(user!.id!, { ...data, createdAt: new Date() });
    } else {
      await UserService.addUser({ ...data, createdAt: new Date() });
    }
  };

  return <FormComponent initialData={initialData} fields={fields} onSubmit={onSubmit} title={update ? "Modifier l'utilisateur" : "Créer un utilisateur"} />;
}

type UserFormProps = {
  user?: User;
  update?: boolean;
}