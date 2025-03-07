import UserDetails from "@/app/components/users/userDetails";

export default async function EditUserPage({ params, }: { params: Promise<{ userId: string }> }) {
    const { userId } = await params;
    const id = Number(userId);
  
    if (isNaN(id)) return <p>ID invalide</p>;
    
    return <UserDetails id={id} />;
  /* const user = await getUserById(params.id);

  if (!user) {
    return <p>Utilisateur non trouvé</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Modifier l'utilisateur</h1>
      <UserForm user={user} />
    </div>
  ); */
}