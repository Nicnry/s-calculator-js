import UserEdit from "@/app/components/users/userEdit";

export default async function EditUserPage({ params, }: { params: Promise<{ userId: string }> }) {
    const { userId } = await params;
    const id = Number(userId);
  
    if (isNaN(id)) return <p>ID invalide</p>;
    
    return <UserEdit id={id} />;
}