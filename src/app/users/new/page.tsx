import UserForm from "@/app/components/users/userForm";

export default function NewUserPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Créer un utilisateur</h1>
      <UserForm />
    </div>
  );
}
